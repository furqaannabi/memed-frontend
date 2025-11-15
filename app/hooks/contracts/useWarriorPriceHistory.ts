import { usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";

/**
 * Interface for price point with timestamp from blockchain events
 */
interface PricePoint {
  price: bigint;
  timestamp: number;
}

/**
 * Hook to fetch historical mint prices from WarriorMinted blockchain events.
 *
 * This hook:
 * 1. Queries WarriorMinted events from the blockchain
 * 2. Gets timestamp for each event from block data
 * 3. Returns sorted price history (oldest to newest)
 *
 * @param nftAddress The warrior NFT contract address
 * @param fromBlock Starting block to query from (default: 0 = from deployment)
 * @returns Price history array and loading state
 */
export function useWarriorPriceHistory(
  nftAddress: `0x${string}` | undefined,
  fromBlock: bigint = 0n
) {
  const publicClient = usePublicClient();
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't fetch if no address or no client
    if (!nftAddress || !publicClient) return;

    const fetchPriceHistory = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        // Query WarriorMinted events from blockchain
        // Event: WarriorMinted(uint256 indexed tokenId, address indexed owner, uint256 price)
        const events = await publicClient.getLogs({
          address: nftAddress,
          event: parseAbiItem(
            "event WarriorMinted(uint256 indexed tokenId, address indexed owner, uint256 price)"
          ),
          fromBlock: fromBlock,
          toBlock: "latest",
        });

        // Get timestamp for each event by fetching block data
        // Blockchain events don't directly include timestamps, but blocks do
        const historyWithTimestamps = await Promise.all(
          events.map(async (event) => {
            const block = await publicClient.getBlock({
              blockNumber: event.blockNumber,
            });
            return {
              price: event.args.price!, // Mint price from event
              timestamp: Number(block.timestamp), // Block timestamp
            };
          })
        );

        // Sort by timestamp (oldest first) for proper chart display
        historyWithTimestamps.sort((a, b) => a.timestamp - b.timestamp);

        setPriceHistory(historyWithTimestamps);
      } catch (err) {
        console.error("Error fetching price history:", err);
        const errorMessage = err instanceof Error ? err : new Error("Failed to fetch price history");
        setError(errorMessage);
        setPriceHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [nftAddress, publicClient, fromBlock]);

  return { priceHistory, isLoading, error };
}
