/**
 * Chainlink Price Feed Hooks
 *
 * Provides hooks for fetching ETH/USD price from Chainlink oracle
 * and converting Wei amounts to USD values.
 *
 * Features:
 * - Real-time ETH/USD price from Chainlink (polls every 30 seconds)
 * - Staleness detection (warns if price data >1 hour old)
 * - Wei to USD conversion with proper decimal handling
 * - Formatted USD display with thousands separators
 */

import { useReadContract } from "wagmi";
import { chainlinkPriceFeedAbi } from "@/abi";
import { CHAINLINK_ETH_USD_ADDRESS } from "@/config/contracts";

/**
 * Fetch current ETH/USD price from Chainlink oracle
 *
 * Returns price data with staleness check:
 * - price: Current ETH/USD price (8 decimals, e.g., 250000000000 = $2,500)
 * - updatedAt: Timestamp of last price update
 * - isStale: true if price hasn't updated in >1 hour
 *
 * Automatically refetches every 30 seconds for real-time updates
 */
export function useEthUsdPrice() {
  const { data: priceData, ...rest } = useReadContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: chainlinkPriceFeedAbi,
    functionName: "latestRoundData",
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Extract price and timestamp from Chainlink response
  if (!priceData) {
    return { data: null, ...rest };
  }

  const [, answer, , updatedAt] = priceData;
  const price = BigInt(answer);
  const timestamp = Number(updatedAt);

  // Check if price is stale (>1 hour old)
  const currentTime = Math.floor(Date.now() / 1000);
  const isStale = currentTime - timestamp > 3600; // 3600 seconds = 1 hour

  return {
    data: {
      price,
      updatedAt: timestamp,
      isStale,
    },
    ...rest,
  };
}

/**
 * Convert Wei amount to formatted USD string
 *
 * @param weiAmount - Amount in Wei (18 decimals), e.g., parseEther("1.5")
 * @returns Formatted USD string, e.g., "$3,750.00"
 *
 * Returns null if price feed unavailable or amount is undefined
 *
 * Conversion formula:
 * USD = (weiAmount × ethUsdPrice) / 10^26
 *
 * Example:
 * - weiAmount: 1.5 ETH = 1.5 × 10^18 Wei
 * - ethUsdPrice: $2,500 = 2500 × 10^8 (Chainlink 8 decimals)
 * - Result: (1.5 × 10^18 × 2500 × 10^8) / 10^26 = $3,750
 */
export function useWeiToUsd(weiAmount: bigint | undefined): string | null {
  const { data: priceInfo } = useEthUsdPrice();

  // Return null if price unavailable or amount not provided
  if (!priceInfo || !weiAmount) {
    return null;
  }

  // Convert Wei to USD
  // ETH has 18 decimals, Chainlink price has 8 decimals
  // Total divisor: 10^26 (18 + 8)
  const usdValueBigInt = (weiAmount * priceInfo.price) / BigInt(10 ** 26);
  const usdValue = Number(usdValueBigInt);

  // Format as USD string with thousands separators
  return formatUsd(usdValue);
}

/**
 * Format numeric USD value with proper formatting
 *
 * @param usdValue - Numeric USD amount
 * @returns Formatted string with dollar sign and commas, e.g., "$1,234.56"
 *
 * Examples:
 * - 2500 → "$2,500.00"
 * - 1234.567 → "$1,234.57" (rounded to 2 decimals)
 * - 0.5 → "$0.50"
 */
function formatUsd(usdValue: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue);
}
