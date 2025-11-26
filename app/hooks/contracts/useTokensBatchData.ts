import { useMemo } from "react";
import { useGetTokenData } from "./useMemedFactory";
import { useFairLaunchData, useIsRefundable } from "./useMemedTokenSale";

/**
 * Combined contract data for a single token
 */
export interface TokenContractData {
  tokenData: any; // Raw tuple from tokenData contract call
  fairLaunchData: any; // Raw tuple from fairLaunchData contract call
  isRefundable: boolean | undefined;
  isUnclaimed: boolean; // Calculated field: token not claimed by creator
  isFailed: boolean; // Calculated field: launch failed or refundable
  status: number; // Fair launch status: 0=NOT_STARTED, 1=ACTIVE, 2=COMPLETED, 3=FAILED
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook return type - map of fairLaunchId to contract data
 */
export interface TokensBatchDataReturn {
  /**
   * Map of fairLaunchId (as string) to combined contract data
   */
  dataMap: Record<string, TokenContractData>;

  /**
   * Whether any of the queries are loading
   */
  isLoading: boolean;

  /**
   * Whether all queries have completed (success or error)
   */
  isComplete: boolean;
}

/**
 * Hook to fetch contract data for a single token
 * This is used internally by useTokensBatchData
 */
function useSingleTokenData(fairLaunchId: string): TokenContractData {
  const contractTokenId = fairLaunchId ? BigInt(fairLaunchId) : 0n;

  // Fetch all contract data
  const {
    data: tokenData,
    isLoading: isLoadingToken,
    error: tokenError
  } = useGetTokenData(contractTokenId);

  const {
    data: fairLaunchData,
    isLoading: isLoadingFairLaunch
  } = useFairLaunchData(contractTokenId);

  const {
    data: isRefundable,
    isLoading: isLoadingRefundable
  } = useIsRefundable(contractTokenId);

  // Calculate derived fields
  const isLoading = isLoadingToken || isLoadingFairLaunch || isLoadingRefundable;

  // Check if token is unclaimed
  // tokenData structure: [token, warriorNFT, creator, isClaimedByCreator, ...]
  // isClaimedByCreator is at index 3
  const isUnclaimed = tokenData && !tokenError
    ? !(tokenData as any)[3]
    : false;

  // Determine status and if failed
  const status = fairLaunchData ? (fairLaunchData as any)[0] : 0;
  const isFailed = isRefundable === true || status === 3;

  return {
    tokenData,
    fairLaunchData,
    isRefundable,
    isUnclaimed,
    isFailed,
    status,
    isLoading,
    error: tokenError,
  };
}

/**
 * Centralized hook to batch-fetch contract data for multiple tokens
 *
 * This eliminates the performance problem of each token card making 3 separate
 * contract calls. Instead, we fetch all data once at the page level and pass
 * it down as props.
 *
 * @param fairLaunchIds - Array of fairLaunchId strings to fetch data for
 * @returns Object with dataMap (fairLaunchId -> TokenContractData) and loading states
 *
 * @example
 * ```tsx
 * // In explore.tsx - fetch once for all tokens
 * const { dataMap, isLoading } = useTokensBatchData(
 *   tokens.map(t => t.fairLaunchId).filter(Boolean)
 * );
 *
 * // Pass to child components
 * <MemeTokensList tokens={tokens} contractDataMap={dataMap} />
 *
 * // In MemeTokenCard.tsx - use pre-fetched data
 * const contractData = contractDataMap[token.fairLaunchId];
 * const isFailed = contractData?.isFailed ?? false;
 * ```
 */
export function useTokensBatchData(
  fairLaunchIds: (string | undefined)[]
): TokensBatchDataReturn {
  // Ensure fairLaunchIds is always an array
  const safeIds = Array.isArray(fairLaunchIds) ? fairLaunchIds : [];

  // Filter and deduplicate - stable reference to avoid infinite loops
  const validIds = useMemo(() => {
    return Array.from(
      new Set(safeIds.filter((id): id is string => !!id))
    );
  }, [safeIds.join(',')]);

  // WORKAROUND for hook order violations:
  // We'll use a stable maximum number of hooks by always calling hooks for a fixed array
  // This prevents React from seeing different hook counts between renders
  // NOTE: This is not ideal and should be refactored to use React Query's useQueries

  // Create a stable array with max expected tokens (e.g., 20 for pagination)
  // Fill with empty strings for unused slots
  const MAX_TOKENS = 20;
  const paddedIds = useMemo(() => {
    const padded = [...validIds];
    while (padded.length < MAX_TOKENS) {
      padded.push(''); // Empty string for unused slots
    }
    return padded.slice(0, MAX_TOKENS); // Ensure max length
  }, [validIds.join(',')]);

  // Now we always call exactly MAX_TOKENS hooks, fixing the hook order
  const results = paddedIds.map(id => ({
    id,
    data: useSingleTokenData(id || '0') // Use '0' for empty slots (will return default data)
  }));

  // Build the data map - only include valid IDs (exclude padding)
  const dataMap: Record<string, TokenContractData> = {};
  results.forEach(({ id, data }) => {
    if (id && id !== '0') { // Skip empty padding slots
      dataMap[id] = data;
    }
  });

  // Calculate aggregate loading states
  const isLoading = results.some(r => r.data.isLoading);
  const isComplete = results.every(r => !r.data.isLoading);

  return {
    dataMap,
    isLoading,
    isComplete,
  };
}
