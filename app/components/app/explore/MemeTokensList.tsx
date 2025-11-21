import { useState, useMemo } from "react";
import { MemeTokenCard } from "./MemeTokenCard";

interface MemeToken {
  id: string;
  name: string;
  creator: string;
  price: number;
  marketCap: string;
  progress: number;
  image: string; // Token image URL/key
  fairLaunchId?: string; // Fair launch ID for fetching contract status
  address?: string; // Token contract address
  active?: boolean;
  badge?: string;
  badgeColor?: string;
  createdAt?: string; // Added for sorting by time
}

interface MemeTokensListProps {
  tokens: MemeToken[];
}

type SortOption = "new" | "popular" | "marketCap";

export function MemeTokensList({ tokens }: MemeTokensListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show 9 tokens per page (3x3 grid on xl screens)

  // Sort tokens based on selected option
  const sortedTokens = useMemo(() => {
    const tokensCopy = [...tokens];

    switch (sortBy) {
      case "new":
        // Sort by createdAt descending (newest first)
        return tokensCopy.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      case "popular":
        // Sort by progress descending (most progress first)
        return tokensCopy.sort((a, b) => b.progress - a.progress);

      case "marketCap":
        // Sort by price descending (highest price first)
        return tokensCopy.sort((a, b) => b.price - a.price);

      default:
        return tokensCopy;
    }
  }, [tokens, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTokens = sortedTokens.slice(startIndex, endIndex);

  // Reset to page 1 when sort changes
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show current page and surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="col-span-1 xl:col-span-3 bg-neutral-900 border p-2 sm:p-4 xl:p-2 border-neutral-800 rounded-xl min-h-[350px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4 bg-dark-900 rounded-md p-1.5 sm:p-2">
          <span className="text-gray-400 text-xs sm:text-sm">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-neutral-900 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-lg border cursor-pointer border-neutral-800 focus:outline-none focus:border-green-500"
          >
            <option value="new">New</option>
            <option value="popular">Popular</option>
            <option value="marketCap">Market Cap</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {sortedTokens.map((token) => (
          <MemeTokenCard key={token.id} token={token} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 mt-auto pt-4">
        <button className="p-1.5 sm:p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-neutral-800 cursor-pointer">
          1
        </button>
        <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          2
        </button>
        <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          3
        </button>
        <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          4
        </button>
        <span className="px-1 sm:px-2 text-xs sm:text-sm">...</span>
        <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          100
        </button>
        <button className="p-1.5 sm:p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
