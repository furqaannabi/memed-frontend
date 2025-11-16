import { usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";
import { ENGAGE_TO_EARN_ADDRESS } from "@/config/contracts";

/**
 * Interface for creator activity with timestamp
 */
interface CreatorActivity {
  type: "unlock" | "claim";
  amount: bigint;
  timestamp: number;
  transactionHash: `0x${string}`;
}

/**
 * Hook to fetch recent creator incentive events (unlocked and claimed)
 *
 * This hook:
 * 1. Queries CreatorIncentivesUnlocked and CreatorIncentivesClaimed events
 * 2. Gets timestamp for each event from block data
 * 3. Returns sorted activity history (newest first)
 *
 * @param maxBlocksBack Maximum number of blocks to look back (default: 100k blocks)
 * @returns Recent creator activity array and loading state
 */
export function useCreatorActivity(maxBlocksBack: bigint = 100000n) {
  const publicClient = usePublicClient();
  const [activityHistory, setActivityHistory] = useState<CreatorActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't fetch if no client
    if (!publicClient) {
      setActivityHistory([]);
      return;
    }

    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get current block number to calculate range
        const latestBlock = await publicClient.getBlockNumber();

        // Only fetch recent blocks
        const calculatedFromBlock =
          latestBlock > maxBlocksBack ? latestBlock - maxBlocksBack : 0n;

        console.log(
          `Fetching creator activity from block ${calculatedFromBlock} to ${latestBlock}`
        );

        // Query both unlock and claim events
        const [unlockedEvents, claimedEvents] = await Promise.all([
          // CreatorIncentivesUnlocked events
          publicClient.getLogs({
            address: ENGAGE_TO_EARN_ADDRESS,
            event: parseAbiItem(
              "event CreatorIncentivesUnlocked(uint256 amount)"
            ),
            fromBlock: calculatedFromBlock,
            toBlock: latestBlock,
          }),
          // CreatorIncentivesClaimed events
          publicClient.getLogs({
            address: ENGAGE_TO_EARN_ADDRESS,
            event: parseAbiItem(
              "event CreatorIncentivesClaimed(uint256 amount)"
            ),
            fromBlock: calculatedFromBlock,
            toBlock: latestBlock,
          }),
        ]);

        console.log(
          `Found ${unlockedEvents.length} unlock events and ${claimedEvents.length} claim events`
        );

        // Process unlocked events
        const unlockedActivities = await Promise.all(
          unlockedEvents.map(async (event) => {
            const block = await publicClient.getBlock({
              blockNumber: event.blockNumber,
            });
            return {
              type: "unlock" as const,
              amount: event.args.amount!,
              timestamp: Number(block.timestamp),
              transactionHash: event.transactionHash,
            };
          })
        );

        // Process claimed events
        const claimedActivities = await Promise.all(
          claimedEvents.map(async (event) => {
            const block = await publicClient.getBlock({
              blockNumber: event.blockNumber,
            });
            return {
              type: "claim" as const,
              amount: event.args.amount!,
              timestamp: Number(block.timestamp),
              transactionHash: event.transactionHash,
            };
          })
        );

        // Combine and sort by timestamp (newest first)
        const allActivities = [...unlockedActivities, ...claimedActivities];
        allActivities.sort((a, b) => b.timestamp - a.timestamp);

        setActivityHistory(allActivities);
      } catch (err) {
        console.error("Error fetching creator activity:", err);
        const errorMessage =
          err instanceof Error
            ? err
            : new Error("Failed to fetch creator activity");
        setError(errorMessage);
        setActivityHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchActivity();

    // Set up periodic refetch every 30 seconds to show new creator activity
    // 30s interval balances fresh data with reasonable RPC usage
    const intervalId = setInterval(fetchActivity, 30000);

    // Cleanup interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [publicClient, maxBlocksBack]);

  return { activityHistory, isLoading, error };
}
