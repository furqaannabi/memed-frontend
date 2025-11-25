import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { TOKEN_SALE_ADDRESS } from "@/config/contracts";
import { memedTokenSaleAbi } from "@/abi";
import { baseSepolia, base } from "wagmi/chains";

/**
 * Hook to read the status of a specific fair launch.
 * Polls every 5 seconds to keep status up-to-date in real-time.
 * @param launchId The ID of the fair launch.
 */
export function useGetFairLaunchStatus(launchId: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getFairLaunchStatus",
    args: [launchId],
    query: {
      enabled: !!launchId,
      refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  });
}

/**
 * Hook to read full fair launch data using fairLaunchData function.
 * Polls every 5 seconds to keep data up-to-date in real-time.
 * @param launchId The ID of the fair launch.
 */
export function useFairLaunchData(launchId: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "fairLaunchData",
    args: [launchId],
    chainId: baseSepolia.id, // Force Base Sepolia since contract is deployed there
    query: {
      enabled: !!launchId && launchId >= 0n,
      refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  });
}

/**
 * Hook to read a user's commitment to a fair launch.
 * Polls every 5 seconds to keep commitment data up-to-date in real-time.
 * @param launchId The ID of the fair launch.
 * @param userAddress The address of the user (optional, defaults to connected wallet).
 */
export function useGetUserCommitment(
  launchId: bigint,
  userAddress?: `0x${string}`,
) {
  const { address: connectedAddress } = useAccount();
  const addressToQuery = userAddress || connectedAddress;

  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getUserCommitment",
    args: [
      launchId,
      addressToQuery ?? "0x0000000000000000000000000000000000000000",
    ],
    query: {
      enabled: !!launchId && !!addressToQuery,
      refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  });
}

/**
 * Hook to get the expected claim for a user in a fair launch.
 * Returns the actual token amount and refund amount the user will receive.
 * This accounts for oversubscription - if the launch is oversubscribed,
 * users get proportional tokens and a refund of excess ETH.
 * Polls every 5 seconds to keep data up-to-date in real-time.
 * @param launchId The ID of the fair launch.
 * @param userAddress The address of the user (optional, defaults to connected wallet).
 * @returns Object with tokens (bigint) and refundAmount (bigint)
 */
export function useGetExpectedClaim(
  launchId: bigint,
  userAddress?: `0x${string}`,
) {
  const { address: connectedAddress } = useAccount();
  const addressToQuery = userAddress || connectedAddress;

  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getExpectedClaim",
    args: [
      launchId,
      addressToQuery ?? "0x0000000000000000000000000000000000000000",
    ],
    query: {
      enabled: !!launchId && !!addressToQuery,
      refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  });
}

/**
 * Hook to calculate tokens and refund amount for a given commitment.
 * This is used to show users what they'll receive BEFORE they commit.
 * Useful for showing refund amounts when launch is oversubscribed.
 * @param launchId The ID of the fair launch.
 * @param commitAmount The amount the user wants to commit (in wei).
 * @returns Tuple [tokens: bigint, refundAmount: bigint]
 */
export function useCalculateTokensForCommitment(
  launchId: bigint,
  commitAmount: bigint,
) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "calculateTokensForCommitment",
    args: [launchId, commitAmount],
    query: {
      enabled: launchId > 0n && commitAmount > 0n,
      // Don't poll constantly - only refetch when amount changes
      refetchInterval: false,
    },
  });
}

/**
 * Hook for the `commitToFairLaunch` write function.
 * This function takes _id and amount as parameters.
 */
export function useCommitToFairLaunch() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type CommitToFairLaunchArgs = {
    launchId: bigint;
    amount: bigint;
  };

  const commitToFairLaunch = (args: CommitToFairLaunchArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "commitToFairLaunch",
      args: [args.launchId, args.amount],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    commitToFairLaunch,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}



/**
 * Hook to read the fixed price per token in wei.
 */
export function usePricePerTokenWei() {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "PRICE_PER_TOKEN_WEI",
  });
}

/**
 * Hook to read the current ID counter from the contract.
 */
export function useCurrentId() {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "id",
  });
}

/**
 * Hook to check if a fair launch ID exists by checking if it's within valid range
 * @param launchId The ID to validate
 */
export function useValidateFairLaunchId(launchId: bigint) {
  const { data: currentId, isLoading } = useCurrentId();
  
  const isValid = currentId !== undefined && launchId > 0n && launchId <= currentId;
  
  return {
    isValid,
    isLoading,
    currentMaxId: currentId,
  };
}

/**
 * Hook for the `cancelCommit` write function.
 */
export function useCancelCommit() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type CancelCommitArgs = {
    id: bigint;
  };

  const cancelCommit = (args: CancelCommitArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "cancelCommit",
      args: [args.id],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    cancelCommit,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

/**
 * Hook for the `claim` write function.
 * Allows users to claim their tokens after a successful fair launch (status 3).
 */
export function useClaim() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type ClaimArgs = {
    id: bigint;
  };

  const claim = (args: ClaimArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "claim",
      args: [args.id],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    claim,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

/**
 * Hook for the `refund` write function.
 * Allows users to get their committed funds back after a failed fair launch (status 4).
 */
export function useRefund() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type RefundArgs = {
    id: bigint;
  };

  const refund = (args: RefundArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "refund",
      args: [args.id],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    refund,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

/**
 * Hook to check if a fair launch is refundable (failed).
 * Returns true if the launch failed and users can claim refunds.
 * Polls every 5 seconds for real-time updates.
 * @param launchId The ID of the fair launch.
 */
export function useIsRefundable(launchId: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "isRefundable",
    args: [launchId],
    query: {
      enabled: !!launchId && launchId >= 0n,
      refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    },
  });
}

/**
 * Hook to get the fair launch duration from contract.
 * Returns duration in seconds (e.g., 7 days = 604800 seconds).
 */
export function useFairLaunchDuration() {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "FAIR_LAUNCH_DURATION",
  });
}

/**
 * Hook to get the ETH raise target from contract.
 * Returns target amount in wei (e.g., 40 ETH = 40 * 10^18 wei).
 */
export function useRaiseEth() {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "RAISE_ETH",
  });
}

/**
 * Hook to check if a user is allowed to launch/mint a new token.
 * Returns true if the user is eligible to launch a token, false otherwise.
 *
 * This should be checked before allowing users to fill out token launch forms
 * to prevent them from wasting time on forms that will fail at contract level.
 *
 * @param userAddress - The wallet address to check eligibility for
 * @returns Boolean indicating if user can mint/launch a token
 */
export function useIsMintable(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "isMintable",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      refetchInterval: 5000, // Poll every 5 seconds to catch status changes
    },
  });
}
