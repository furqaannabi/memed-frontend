import { useState, useMemo, useEffect } from "react";
import { SwordsIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BattleCard } from "@/components/shared/BattleCard";
import { useGetBattles } from "@/hooks/contracts/useMemedBattle";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api/client";

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

interface ActiveBattlesProps {
  tokenAddress: `0x${string}`;
}

const ActiveBattles = ({ tokenAddress }: ActiveBattlesProps) => {
  // Pagination state - show 2 battles per page to match the grid
  const [currentPage, setCurrentPage] = useState(0);
  const battlesPerPage = 2;

  // State to hold token details
  const [tokenDetailsMap, setTokenDetailsMap] = useState<
    Record<string, { name: string; image: string }>
  >({});

  // Get user's tokens from auth store
  const { user } = useAuthStore();

  // Fetch all battles from contract
  const { data: battlesData, isLoading } = useGetBattles();
  const battles: Battle[] = (battlesData as Battle[]) || [];

  // Filter for active battles (STARTED status = 2) involving this token
  const activeBattles = useMemo(() => {
    return battles.filter(
      (battle) =>
        battle.status === 2 && // STARTED (Active)
        (battle.memeA.toLowerCase() === tokenAddress.toLowerCase() ||
          battle.memeB.toLowerCase() === tokenAddress.toLowerCase())
    );
  }, [battles, tokenAddress]);

  // Fetch token details for all tokens in active battles
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

      // Get unique token addresses from active battles
      const uniqueAddresses = new Set<string>();
      activeBattles.forEach((battle) => {
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

    if (activeBattles.length > 0) {
      fetchTokenDetails();
    }
  }, [activeBattles, user]);

  // Calculate pagination
  const totalPages = Math.ceil(activeBattles.length / battlesPerPage);
  const startIndex = currentPage * battlesPerPage;
  const endIndex = startIndex + battlesPerPage;
  const currentBattles = activeBattles.slice(startIndex, endIndex);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Helper to determine which side is this token
  const getTokenSide = (battle: Battle): "left" | "right" => {
    return battle.memeA.toLowerCase() === tokenAddress.toLowerCase()
      ? "left"
      : "right";
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <SwordsIcon />
          Active Battles
          {activeBattles.length > 0 && (
            <span className="text-sm text-neutral-400 font-normal">
              ({activeBattles.length})
            </span>
          )}
        </h2>

        {/* Pagination Controls - Only show if more than 2 battles */}
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
      ) : activeBattles.length === 0 ? (
        // Empty State
        <div className="text-center py-12 text-neutral-400">
          <SwordsIcon className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
          <p>No active battles at the moment</p>
        </div>
      ) : (
        // Battle Cards Grid
        <div className="grid lg:grid-cols-2 gap-6">
          {currentBattles.map((battle) => {
            const memeADetails = tokenDetailsMap[battle.memeA.toLowerCase()] || {
              name: `${battle.memeA.slice(0, 6)}...`,
              image: "",
            };
            const memeBDetails = tokenDetailsMap[battle.memeB.toLowerCase()] || {
              name: `${battle.memeB.slice(0, 6)}...`,
              image: "",
            };

            return (
              <BattleCard
                key={Number(battle.battleId)}
                leftImage={memeADetails.image}
                rightImage={memeBDetails.image}
                leftLabel={memeADetails.name}
                rightLabel={memeBDetails.name}
                leftViews={`${Number(battle.heatA).toLocaleString()} Heat`}
                rightViews={`${Number(battle.heatB).toLocaleString()} Heat`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveBattles;
