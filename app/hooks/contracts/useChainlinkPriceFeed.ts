/**
 * ETH/USD Price Feed Hooks
 *
 * Provides hooks for fetching ETH/USD price and converting Wei to USD.
 * 
 * Priority:
 * 1. Chainlink on-chain oracle (decentralized, mainnet-ready)
 * 2. CoinGecko API fallback (for testnets where Chainlink unavailable)
 */

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { formatEther } from "viem";
import { chainlinkPriceFeedAbi } from "@/abi";
import { CHAINLINK_ETH_USD_ADDRESS } from "@/config/contracts";

// CoinGecko cache for fallback
let coinGeckoPrice: number | null = null;
let lastCoinGeckoFetch = 0;
const CACHE_DURATION = 60000; // 60 seconds

/**
 * Fetch ETH/USD price - Chainlink first, CoinGecko fallback
 */
export function useEthUsdPrice() {
  // Try Chainlink first
  const { data: chainlinkData, isLoading: chainlinkLoading, error: chainlinkError } = useReadContract({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: chainlinkPriceFeedAbi,
    functionName: "latestRoundData",
    chainId: baseSepolia.id,
    query: {
      refetchInterval: 30000,
    },
  });

  // CoinGecko fallback state
  const [coinGeckoState, setCoinGeckoState] = useState<{
    price: number | null;
    loading: boolean;
  }>({ price: coinGeckoPrice, loading: false });

  // Fetch CoinGecko if Chainlink fails
  useEffect(() => {
    const shouldFetchCoinGecko = !chainlinkData && !chainlinkLoading;

    if (shouldFetchCoinGecko) {
      const now = Date.now();
      
      // Use cache if valid
      if (coinGeckoPrice && now - lastCoinGeckoFetch < CACHE_DURATION) {
        setCoinGeckoState({ price: coinGeckoPrice, loading: false });
        return;
      }

      setCoinGeckoState(prev => ({ ...prev, loading: true }));
      
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
        .then(res => res.json())
        .then(data => {
          if (data?.ethereum?.usd) {
            coinGeckoPrice = data.ethereum.usd;
            lastCoinGeckoFetch = now;
            setCoinGeckoState({ price: data.ethereum.usd, loading: false });
          }
        })
        .catch(() => {
          setCoinGeckoState(prev => ({ ...prev, loading: false }));
        });
    }
  }, [chainlinkData, chainlinkLoading, chainlinkError]);

  // If Chainlink available, use it
  if (chainlinkData) {
    const [, answer, , updatedAt] = chainlinkData;
    const price = Number(answer) / 1e8; // Convert from 8 decimals
    
    return {
      data: {
        price: BigInt(answer),
        priceNumber: price,
        isStale: Date.now() / 1000 - Number(updatedAt) > 3600,
        source: "chainlink" as const,
      },
      isLoading: false,
      error: null,
    };
  }

  // Use CoinGecko fallback
  if (coinGeckoState.price) {
    return {
      data: {
        price: BigInt(Math.round(coinGeckoState.price * 1e8)),
        priceNumber: coinGeckoState.price,
        isStale: false,
        source: "coingecko" as const,
      },
      isLoading: false,
      error: null,
    };
  }

  // Still loading
  return {
    data: null,
    isLoading: chainlinkLoading || coinGeckoState.loading,
    error: chainlinkError,
  };
}

/**
 * Convert Wei amount to formatted USD string
 */
export function useWeiToUsd(weiAmount: bigint | undefined): string | null {
  const { data: priceInfo } = useEthUsdPrice();

  if (!priceInfo || !weiAmount) {
    return null;
  }

  const ethAmount = Number(formatEther(weiAmount));
  const usdValue = ethAmount * priceInfo.priceNumber;

  if (usdValue < 0.01 && usdValue > 0) {
    return `$${usdValue.toFixed(6)}`;
  }

  return formatUsd(usdValue);
}

function formatUsd(usdValue: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue);
}
