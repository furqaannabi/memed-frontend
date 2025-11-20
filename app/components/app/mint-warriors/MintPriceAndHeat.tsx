import { TrendingUp, TrendingDown, Minus, Flame, SwordIcon } from "lucide-react";
import { formatUnits } from "viem";
import { useGetCurrentPrice, useGetBasePrice } from "@/hooks/contracts/useMemedWarriorNFT";
import { useTokenHeat } from "@/hooks/contracts/useMemedFactory";

/**
 * Format large numbers for display with proper decimal places and compact notation
 * @param value - The number value as a string (from formatUnits)
 * @returns Formatted string with appropriate precision
 */
function formatTokenAmount(value: string): string {
  const num = parseFloat(value);

  // Handle zero and very small numbers
  if (num === 0) return "0";
  if (num < 0.01) return "<0.01";

  // For millions (1,000,000+)
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }

  // For thousands (1,000+)
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }

  // For smaller numbers, show 2 decimal places
  return num.toFixed(2);
}

/**
 * Format heat score number for display
 * @param heat - The heat score as bigint or number
 * @returns Formatted string with commas
 */
function formatHeatScore(heat: bigint | number): string {
  const heatNum = typeof heat === 'bigint' ? Number(heat) : heat;
  return heatNum.toLocaleString();
}

interface MintPriceAndHeatProps {
  warriorNFTAddress?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  tokenSymbol?: string; // Token symbol for display (e.g., "MEME", "PEPE")
}

/**
 * MintPriceAndHeat Component
 *
 * Displays real-time warrior NFT mint pricing and token heat score.
 * - Current mint price (dynamically calculated based on heat)
 * - Base price and heat bonus breakdown
 * - Price change percentage
 * - Community heat score with visual progress bar
 */
export default function MintPriceAndHeat({
  warriorNFTAddress,
  tokenAddress,
  tokenSymbol = "MEME"
}: MintPriceAndHeatProps) {
  // Get current mint price and base price from warrior NFT contract
  const { data: currentPrice } = useGetCurrentPrice(warriorNFTAddress);
  const { data: basePrice } = useGetBasePrice(warriorNFTAddress);

  // Get token heat score from factory contract
  const { data: heatScore } = useTokenHeat(tokenAddress);

  // Calculate heat bonus (difference between current price and base price)
  const heatBonus = currentPrice && basePrice ? currentPrice - basePrice : 0n;

  // Calculate percentage change from base price
  const percentageChange = basePrice && basePrice > 0n && currentPrice
    ? Number((heatBonus * 100n) / basePrice)
    : 0;

  // Calculate heat score progress (example: max heat = 150,000 for 150% progress)
  // Adjust MAX_HEAT based on your contract's logic
  const MAX_HEAT = 150000n;
  const heatProgress = heatScore && MAX_HEAT > 0n
    ? Math.min(Number((heatScore * 100n) / MAX_HEAT), 150) // Cap at 150%
    : 0;

  // Determine trend indicator
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  return (
    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
      {/* Current Mint Price Section */}
      <div className="flex items-center gap-3">
        <SwordIcon className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl text-white">Current Mint Price</h2>
      </div>
      <p className="text-xs text-neutral-500">
        Dynamic pricing based on community heat score
      </p>

      <div className="my-6 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-white mb-2">
            {currentPrice
              ? `${formatTokenAmount(formatUnits(currentPrice, 18))} ${tokenSymbol}`
              : "Loading..."}
          </div>
          <div className="text-sm text-gray-400 mb-4">
            Base: {basePrice ? formatTokenAmount(formatUnits(basePrice, 18)) : "..."}
            {" • "}
            Heat Bonus: {heatBonus ? formatTokenAmount(formatUnits(heatBonus, 18)) : "..."}
          </div>
        </div>
        <div className="flex justify-end h-fit">
          {percentageChange !== 0 ? (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
              isPositive
                ? "bg-green-500/20 text-green-500"
                : isNegative
                ? "bg-red-500/20 text-red-500"
                : "bg-neutral-500/20 text-neutral-500"
            }`}>
              {isPositive && <TrendingUp className="w-4 h-4" />}
              {isNegative && <TrendingDown className="w-4 h-4" />}
              {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
              {isPositive && "+"}{percentageChange.toFixed(1)}%
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-neutral-500/20 text-neutral-500 rounded-md text-sm font-medium">
              <Minus className="w-4 h-4" />
              0.0%
            </div>
          )}
        </div>
      </div>

      {/* Community Heat Score Section */}
      <div className="flex items-center gap-3 mb-4">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold text-white">
          Community Heat Score
        </h2>
        <div className="ml-auto text-xl font-bold text-white">
          {heatScore ? formatHeatScore(heatScore) : "0"}
        </div>
      </div>

      <div className="w-full bg-neutral-800 rounded-full h-3 mb-2">
        <div
          className="bg-gradient-to-r from-green-500 to-orange-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(heatProgress, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span className="text-center">{heatProgress.toFixed(0)}%</span>
        <span>150%</span>
      </div>
    </div>
  );
}
