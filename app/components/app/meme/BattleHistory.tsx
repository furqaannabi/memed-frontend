import { useState, useMemo, useEffect } from "react";
import { Trophy, ChevronLeft, ChevronRight, Loader2, Clock } from "lucide-react";
import { useGetBattles } from "@/hooks/contracts/useMemedBattle";
import { formatEther } from "viem";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api/client";

// Battle status enum - include DRAW (status 4)
type BattleStatus = 0 | 1 | 2 | 3 | 4;

// Battle interface from contract
interface Battle {
  battleId: bigint;
  memeA: `0x${string}`;
  memeB: `0x${string}`;
  memeANftsAllocated: bigint;
  memeBNftsAllocated: bigint;
  heatA: bigint;
  heatB: bigint;
  startTime: bigint;
  endTime: bigint;
  status: BattleStatus;
  winner: `0x${string}`;
  totalReward: bigint;
}

interface BattleHistoryProps {
  tokenAddress: `0x${string}`;
}

const BattleHistory = ({ tokenAddress }: BattleHistoryProps) => {
  // Pagination state - show 5 battles per page
  const [currentPage, setCurrentPage] = useState(0);
  const battlesPerPage = 5;

  // State to hold token details
  const [tokenDetailsMap, setTokenDetailsMap] = useState<
    Record<string, { name: string; image: string }>
  >({});

  // Get user's tokens from auth store
  const { user } = useAuthStore();

  // Fetch all battles from contract
  const { data: battlesData, isLoading } = useGetBattles();
  const battles: Battle[] = (battlesData as Battle[]) || [];

  // Filter for completed battles (RESOLVED status = 3 or DRAW status = 4) involving this token
  const completedBattles = useMemo(() => {
    return battles
      .filter(
        (battle) =>
          (battle.status === 3 || battle.status === 4) && // RESOLVED or DRAW
          (battle.memeA.toLowerCase() === tokenAddress.toLowerCase() ||
            battle.memeB.toLowerCase() === tokenAddress.toLowerCase())
      )
      .sort((a, b) => Number(b.endTime) - Number(a.endTime)); // Sort by most recent first
  }, [battles, tokenAddress]);

  // Fetch token details for all tokens in completed battles
  useEffect(() => {
    const fetchTokenDetails = async () => {
      const newTokenDetailsMap: Record<string, { name: string; image: string }> = {};

      // Add user's tokens first
      if (user?.token) {
        user.token.forEach((token) => {
          if (token.address) {
            newTokenDetailsMap[token.address.toLowerCase()] = {
              name: token.metadata?.name || `${token.address.slice(0, 6)}...`,
              image: token.image?.s3Key || (token.metadata as any)?.imageKey || "",
            };
          }
        });
      }

      // Get unique token addresses from completed battles
      const uniqueAddresses = new Set<string>();
      completedBattles.forEach((battle) => {
        uniqueAddresses.add(battle.memeA.toLowerCase());
        uniqueAddresses.add(battle.memeB.toLowerCase());
      });

      // Fetch details for tokens not in user's list
      for (const address of uniqueAddresses) {
        if (!newTokenDetailsMap[address]) {
          try {
            const response = await apiClient.get(`/api/token-by-address/${address}`);
            const tokenData = response.data as any;
            if (tokenData && tokenData.metadata) {
              newTokenDetailsMap[address] = {
                name: tokenData.metadata.name || `${address.slice(0, 6)}...`,
                image: tokenData.metadata.imageKey || tokenData.image?.s3Key || "",
              };
            }
          } catch (error) {
            // Fallback
            newTokenDetailsMap[address] = {
              name: `${address.slice(0, 6)}...${address.slice(-4)}`,
              image: "",
            };
          }
        }
      }

      setTokenDetailsMap(newTokenDetailsMap);
    };

    if (completedBattles.length > 0) {
      fetchTokenDetails();
    }
  }, [completedBattles, user]);

  // Calculate pagination
  const totalPages = Math.ceil(completedBattles.length / battlesPerPage);
  const startIndex = currentPage * battlesPerPage;
  const endIndex = startIndex + battlesPerPage;
  const currentBattles = completedBattles.slice(startIndex, endIndex);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Helper to determine if this token won the battle
  const didTokenWin = (battle: Battle): boolean => {
    return battle.winner.toLowerCase() === tokenAddress.toLowerCase();
  };

  // Helper to get opponent details
  const getOpponentDetails = (battle: Battle): { name: string; address: string } => {
    const opponentAddress =
      battle.memeA.toLowerCase() === tokenAddress.toLowerCase()
        ? battle.memeB
        : battle.memeA;

    const details = tokenDetailsMap[opponentAddress.toLowerCase()];
    return {
      name: details?.name || `${opponentAddress.slice(0, 6)}...${opponentAddress.slice(-4)}`,
      address: opponentAddress,
    };
  };

  // Helper to format time ago
  const getTimeAgo = (endTime: bigint): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(endTime);

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold flex gap-2 items-center">
          <Trophy className="text-yellow-500" /> Battle History
          {completedBattles.length > 0 && (
            <span className="text-sm text-neutral-400 font-normal">
              ({completedBattles.length})
            </span>
          )}
        </h2>

        {/* Pagination Controls - Only show if more than battlesPerPage */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-sm text-neutral-400">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : completedBattles.length === 0 ? (
        // Empty State
        <div className="text-center py-12 text-neutral-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
          <p>No battle history yet</p>
        </div>
      ) : (
        // Battle List
        <div className="space-y-3">
          {currentBattles.map((battle) => {
            const isDraw = battle.status === 4;
            const won = !isDraw && didTokenWin(battle);
            const opponent = getOpponentDetails(battle);
            const timeAgo = getTimeAgo(battle.endTime);
            const reward = formatEther(battle.totalReward);

            return (
              <div
                key={Number(battle.battleId)}
                className="bg-neutral-800 p-4 rounded-lg flex items-center justify-between"
              >
                {/* Left side - status indicator and battle info */}
                <div className="flex items-center gap-3">
                  {/* Status dot */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isDraw
                        ? "bg-yellow-500"
                        : won
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>

                  {/* Battle details */}
                  <div>
                    <div className="text-white text-sm font-medium">
                      vs {opponent.name}
                    </div>
                    <div className="text-neutral-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </div>
                  </div>
                </div>

                {/* Right side - result/amount */}
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    isDraw
                      ? "bg-yellow-500/20 text-yellow-400"
                      : won
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isDraw ? (
                    "Draw"
                  ) : (
                    <>
                      {won ? "+" : ""}
                      {parseFloat(reward).toFixed(4)} tokens
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BattleHistory;
