import { useState, useMemo } from "react";
import { Trophy, ChevronLeft, ChevronRight, Loader2, Clock } from "lucide-react";
import { useGetBattles } from "@/hooks/contracts/useMemedBattle";
import { formatEther } from "viem";

// Battle status enum
type BattleStatus = 0 | 1 | 2 | 3;

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

  // Fetch all battles from contract
  const { data: battlesData, isLoading } = useGetBattles();
  const battles: Battle[] = (battlesData as Battle[]) || [];

  // Filter for completed battles (RESOLVED status = 3) involving this token
  const completedBattles = useMemo(() => {
    return battles
      .filter(
        (battle) =>
          battle.status === 3 && // RESOLVED (Completed)
          (battle.memeA.toLowerCase() === tokenAddress.toLowerCase() ||
            battle.memeB.toLowerCase() === tokenAddress.toLowerCase())
      )
      .sort((a, b) => Number(b.endTime) - Number(a.endTime)); // Sort by most recent first
  }, [battles, tokenAddress]);

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

  // Helper to get opponent address
  const getOpponentAddress = (battle: Battle): string => {
    const opponent =
      battle.memeA.toLowerCase() === tokenAddress.toLowerCase()
        ? battle.memeB
        : battle.memeA;
    return `${opponent.slice(0, 6)}...${opponent.slice(-4)}`;
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
            const won = didTokenWin(battle);
            const opponent = getOpponentAddress(battle);
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
                      won ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>

                  {/* Battle details */}
                  <div>
                    <div className="text-white text-sm font-medium">
                      vs {opponent}
                    </div>
                    <div className="text-neutral-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </div>
                  </div>
                </div>

                {/* Right side - amount */}
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    won
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {won ? "+" : ""}
                  {parseFloat(reward).toFixed(4)} tokens
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
