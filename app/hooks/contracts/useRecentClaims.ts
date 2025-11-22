import { usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";
import { ENGAGE_TO_EARN_ADDRESS } from "@/config/contracts";

/**
 * Interface for claim activity with timestamp
 */
interface ClaimActivity {
  user: `0x${string}`;
  rewardId: bigint;
  amount: bigint;
  timestamp: number;
  transactionHash: `0x${string}`;
}

/**
 * Hook to fetch recent EngagementRewardClaimed events for a user
 *
 * This hook:
 * 1. Queries EngagementRewardClaimed events from the blockchain
 * 2. Gets timestamp for each event from block data
 * 3. Returns sorted claim history (newest first)
 *
 * @param userAddress The user's wallet address to filter claims
 * @param maxBlocksBack Maximum number of blocks to look back (default: 100k blocks)
 * @returns Recent claim activity array and loading state
 */
export function useRecentClaims(
  userAddress: `0x${string}` | undefined,
  maxBlocksBack: bigint = 100000n
) {
  const publicClient = usePublicClient();
  const [claimHistory, setClaimHistory] = useState<ClaimActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't fetch if no address or no client
    if (!userAddress || !publicClient) {
      setClaimHistory([]);
      return;
    }

    const fetchClaimHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get current block number to calculate range
        const latestBlock = await publicClient.getBlockNumber();

        // Only fetch recent blocks to avoid slow queries
        const calculatedFromBlock =
          latestBlock > maxBlocksBack ? latestBlock - maxBlocksBack : 0n;

        // Query EngagementRewardClaimed events from blockchain
        // Event: EngagementRewardClaimed(address indexed user, uint256 indexed rewardId, uint256 amount)
        const events = await publicClient.getLogs({
          address: ENGAGE_TO_EARN_ADDRESS,
          event: parseAbiItem(
            "event EngagementRewardClaimed(address indexed user, uint256 indexed rewardId, uint256 amount)"
          ),
          args: {
            user: userAddress, // Filter by user address
          },
          fromBlock: calculatedFromBlock,
          toBlock: latestBlock,
        });

        // Get timestamp for each event by fetching block data
        const historyWithTimestamps = await Promise.all(
          events.map(async (event) => {
            const block = await publicClient.getBlock({
              blockNumber: event.blockNumber,
            });
            return {
              user: event.args.user!,
              rewardId: event.args.rewardId!,
              amount: event.args.amount!,
              timestamp: Number(block.timestamp),
              transactionHash: event.transactionHash,
            };
          })
        );

        // Sort by timestamp (newest first) for display
        historyWithTimestamps.sort((a, b) => b.timestamp - a.timestamp);

        setClaimHistory(historyWithTimestamps);
      } catch (err) {
        console.error("Error fetching claim history:", err);
        const errorMessage =
          err instanceof Error ? err : new Error("Failed to fetch claim history");
        setError(errorMessage);
        setClaimHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchClaimHistory();

    // Set up periodic refetch every 30 seconds to show new claims
    // 30s interval balances fresh data with reasonable RPC usage
    const intervalId = setInterval(fetchClaimHistory, 30000);

    // Cleanup interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [userAddress, publicClient, maxBlocksBack]);

  return { claimHistory, isLoading, error };
}
