import { useLoaderData, useRevalidator, useSearchParams } from "react-router";
import { useMemo, useState, useEffect } from "react";
import { Intro } from "@/components/app/explore/Intro";
import { MemeTokensList } from "@/components/app/explore/MemeTokensList";
import { Leaderboard } from "@/components/app/explore/Leaderboard";
import meme from "@/assets/images/meme.png";
import { HorizontalCard } from "@/components/app/explore/HorizontalCard";
import { memeTokensLoader, type LoaderData } from "@/lib/api/loaders";
import type { Token } from "@/hooks/api/useAuth";
import { Unlock, Grid3x3, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useTokensBatchData } from "@/hooks/contracts/useTokensBatchData";

// Export the loader for this route, following the project convention
export { memeTokensLoader as loader };

export default function Explore() {
  // Use the data loaded by the loader - now includes pagination
  const loaderData = useLoaderData() as LoaderData<{ tokens: Token[], pagination: any }>;
  const loadedTokens = loaderData.data?.tokens || [];
  const pagination = loaderData.data?.pagination;
  const error = loaderData.error;

  // URL search params for pagination
  const [searchParams, setSearchParams] = useSearchParams();

  // Revalidator hook to refetch data from loader
  const revalidator = useRevalidator();

  // Tab state for switching between claimed and unclaimed tokens
  const [activeTab, setActiveTab] = useState<"all" | "unclaimed">("all");

  // Sync active tab with URL search params for proper backend filtering
  useEffect(() => {
    const currentPage = searchParams.get('page') || '1';
    const claimed = activeTab === "all" ? "true" : "false";

    setSearchParams({ page: currentPage, claimed });
    revalidator.revalidate();
  }, [activeTab]); // Refetch when tab changes

  // Debug logging - see what data we're getting from the API
  useEffect(() => {
    console.log("=== EXPLORE PAGE DEBUG ===");
    console.log("Loaded tokens count:", loadedTokens?.length || 0);
    console.log("Loaded tokens data:", loadedTokens);
    console.log("Pagination:", pagination);
    console.log("Error:", error);
    console.log("========================");
  }, [loadedTokens, pagination, error]);

  // Batch-fetch contract data for all tokens ONCE at page level
  // This eliminates redundant contract calls for price/supply data
  const { dataMap: contractDataMap } = useTokensBatchData(
    (loadedTokens || []).map((token) => token.fairLaunchId)
  );

  // Tokens are already filtered by backend based on 'claimed' query param
  // No need for client-side filtering anymore!
  const tokensToDisplay = loadedTokens || [];

  // Adapt the loaded data to the format expected by the MemeTokenCard component
  const memeTokens = tokensToDisplay.map((token) => ({
    id: token.id,
    name: token.metadata?.name || "Unnamed Token",
    creator:
      token.user?.address
        ? `${token.user.address.slice(0, 6)}...${token.user.address.slice(-4)}`
        : token.userId && typeof token.userId === "string" && token.userId.length >= 4
          ? `user...${token.userId.slice(-4)}`
          : "Unknown",
    ticker: token.metadata?.ticker || "UNKN",
    description: token.metadata?.description || "No description",
    price: 0,
    marketCap: "N/A",
    progress: 0,
    active: false,
    badge: token.claimed ? "Claimed" : "Unclaimed",
    badgeColor: token.claimed ? "bg-green-500" : "bg-yellow-500",
    image: token.metadata?.imageKey || meme,
    fairLaunchId: token.fairLaunchId,
    address: token.address,
    createdAt: token.createdAt,
  }));

  // Create leaderboard from loaded tokens sorted by heat score
  // Only show leaderboard on "claimed" tab
  const leaderboard = useMemo(() => {
    if (!loadedTokens || loadedTokens.length === 0 || activeTab !== "all") {
      return [];
    }

    return [...loadedTokens]
      .filter((token) => token.heat !== undefined && token.heat !== null)
      .sort((a, b) => {
        const heatA = typeof a.heat === "bigint" ? Number(a.heat) : a.heat || 0;
        const heatB = typeof b.heat === "bigint" ? Number(b.heat) : b.heat || 0;
        return heatB - heatA;
      })
      .slice(0, 5)
      .map((token, index) => ({
        id: token.id || index + 1,
        rank: index + 1,
        name: token.metadata?.name || "Unnamed Token",
        username:
          token.user?.socials?.[0]?.username
            ? `@${token.user.socials[0].username}`
            : token.user?.address
              ? `@${token.user.address.slice(0, 6)}...`
              : "@unknown",
        image: token.metadata?.imageKey || meme,
        score: typeof token.heat === "bigint" ? Number(token.heat) : token.heat || 0,
        engagement:
          typeof token.heat === "bigint"
            ? Number(token.heat) >= 1000
              ? `${(Number(token.heat) / 1000).toFixed(1)}K`
              : String(Number(token.heat))
            : "0",
      }));
  }, [loadedTokens, activeTab]);

  // Calculate platform statistics
  const platformStats = useMemo(() => {
    if (!loadedTokens || loadedTokens.length === 0) {
      return { totalTokens: 0, totalHeat: 0 };
    }

    const totalHeat = loadedTokens.reduce((sum, token) => {
      const heat = typeof token.heat === "bigint" ? Number(token.heat) : token.heat || 0;
      return sum + heat;
    }, 0);

    return {
      totalTokens: loadedTokens.length,
      totalHeat,
    };
  }, [loadedTokens]);

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setSearchParams({ page: String(pagination.currentPage + 1) });
      revalidator.revalidate();
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.hasPreviousPage) {
      setSearchParams({ page: String(pagination.currentPage - 1) });
      revalidator.revalidate();
      window.scrollTo(0, 0);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500 bg-gray-900 p-4 rounded-lg">
        <p className="text-lg">Error loading tokens: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8 w-full">
        <Intro totalTokens={platformStats.totalTokens} totalHeat={platformStats.totalHeat} />

        {/* Tabs for switching between claimed and unclaimed tokens */}
        <div className="flex justify-between items-center border-b border-neutral-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "all"
                  ? "border-green-500 text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Claimed {pagination?.totalCount ? `(${pagination.totalCount})` : ''}
            </button>
            <button
              onClick={() => setActiveTab("unclaimed")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "unclaimed"
                  ? "border-yellow-500 text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              <Unlock className="w-4 h-4" />
              Unclaimed {pagination?.totalCount ? `(${pagination.totalCount})` : ''}
            </button>
          </div>

          {/* Refresh button to refetch latest tokens */}
          <button
            onClick={() => revalidator.revalidate()}
            disabled={revalidator.state === "loading"}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh token list"
          >
            <RefreshCw
              className={`w-4 h-4 ${revalidator.state === "loading" ? "animate-spin" : ""}`}
            />
            {revalidator.state === "loading" ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Show message if no tokens */}
        {memeTokens.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            <p className="text-lg mb-4">
              {activeTab === "all"
                ? "No claimed tokens yet. Check the Unclaimed tab!"
                : "No unclaimed tokens at the moment."}
            </p>
          </div>
        )}

        {/* Tokens display */}
        {memeTokens.length > 0 && (
          <>
            {/* Trending tokens carousel - only for claimed tokens */}
            {activeTab === "all" && (
              <div className="overflow-x-auto w-full scrollbar-hide pb-4 mb-4">
                <div className="flex gap-4 w-full overflow-x-auto">
                  {memeTokens.slice(0, 7).map((token) => (
                    <HorizontalCard
                      key={token.id}
                      name={token.name}
                      creator={token.creator}
                      price={token.marketCap || "N/A"}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col xl:flex-row gap-4 md:gap-6 xl:gap-8 w-full">
              {/* Tokens Grid */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 sm:gap-4 xl:gap-2">
                  {/* Tokens List */}
                  <MemeTokensList tokens={memeTokens} contractDataMap={contractDataMap} />

                  {/* Leaderboard - only for claimed tokens */}
                  {activeTab === "all" && <Leaderboard items={leaderboard} />}
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-6">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPreviousPage || revalidator.state === "loading"}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-neutral-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage || revalidator.state === "loading"}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
