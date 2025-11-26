import { MemeTokenCard } from "./MemeTokenCard";
import type { TokenContractData } from "@/hooks/contracts/useTokensBatchData";

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
  contractDataMap: Record<string, TokenContractData>;
}

// Component to render a token card with pre-fetched contract data
function TokenWithClaimStatus({
  token,
  contractDataMap,
}: {
  token: MemeToken;
  contractDataMap: Record<string, TokenContractData>;
}) {
  // Get pre-fetched contract data instead of making individual contract calls
  const contractData = token.fairLaunchId
    ? contractDataMap[token.fairLaunchId]
    : undefined;

  // Use pre-calculated isUnclaimed field from batch data
  const isUnclaimed = contractData?.isUnclaimed ?? false;

  return (
    <MemeTokenCard
      token={token}
      isUnclaimed={isUnclaimed}
      contractData={contractData}
    />
  );
}

export function MemeTokensList({
  tokens,
  contractDataMap,
}: MemeTokensListProps) {
  // Backend already provides sorted and paginated tokens - use them directly
  // No need for client-side sorting or pagination
  const tokensToDisplay = Array.isArray(tokens) ? tokens : [];

  return (
    <div className="col-span-1 bg-neutral-900 border p-2 sm:p-4 xl:p-2 border-neutral-800 rounded-xl min-h-[350px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] flex flex-col">
      {/* Tokens grid - spans full width now that leaderboard is commented out */}
      {/* Shows 3 columns on xl screens, 4 on 2xl screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {tokensToDisplay.map((token) => (
          <TokenWithClaimStatus
            key={token.id}
            token={token}
            contractDataMap={contractDataMap}
          />
        ))}
      </div>
    </div>
  );
}
