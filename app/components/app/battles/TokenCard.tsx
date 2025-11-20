import { Flame, X } from "lucide-react";
import { useTokenHeat } from "@/hooks/contracts/useMemedFactory";

// Token data interface for battle selection
export interface TokenData {
  address: `0x${string}`;
  name: string;
  ticker: string;
  image: string;
  creator: string;
  heat?: bigint;
  marketCap?: string;
}

// Props interface for TokenCard component
interface TokenCardProps {
  token: TokenData;
  onRemove?: () => void;
}

/**
 * TokenCard Component
 *
 * Displays a token card for battle selection with:
 * - Token image
 * - Token name and creator
 * - Real-time heat score
 * - Market cap (if available)
 * - Remove button (if onRemove is provided)
 *
 * @param token - The token data to display
 * @param onRemove - Optional callback when remove button is clicked
 */
export function TokenCard({ token, onRemove }: TokenCardProps) {
  // Fetch real-time heat score for this token from the contract
  const { data: heatData } = useTokenHeat(token.address);
  const heat = heatData || token.heat || 0n;

  return (
    <div className="w-full max-w-sm bg-neutral-900 rounded-lg overflow-hidden shadow-xl flex flex-col justify-between p-2 relative">
      {/* Remove button - only shown if onRemove callback is provided */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 z-10 bg-neutral-800 hover:bg-red-900/40 border border-neutral-700 hover:border-red-500/50 rounded-full p-1.5 transition-all"
          aria-label="Remove token"
        >
          <X className="w-4 h-4 text-neutral-400 hover:text-red-400 transition-colors" />
        </button>
      )}

      {/* Token image display */}
      <div className="h-72 flex items-center justify-center bg-neutral-800 rounded-lg overflow-hidden">
        <img
          src={token.image}
          alt={token.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Token details section */}
      <div className="pb-3 pt-2">
        <div className="text-white font-bold text-lg mb-2 truncate">
          {token.name}
        </div>
        <div className="flex justify-between items-center text-xs gap-3">
          <div>
            <p className="text-gray-400 truncate">Created by {token.creator}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            {/* Heat score display */}
            <div className="flex items-center gap-1">
              <Flame size={14} className="text-orange-500" />
              <span>{Number(heat).toLocaleString()}</span>
            </div>
            {/* Market cap display (optional) */}
            {token.marketCap && (
              <div>
                <span className="text-green-400">MC:</span>
                <span className="ml-1">{token.marketCap}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
