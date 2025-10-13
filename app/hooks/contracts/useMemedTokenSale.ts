import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TOKEN_SALE_ADDRESS } from "@/config/contracts";
import { memedTokenSaleAbi } from "@/abi";

/**
 * Hook to read data for a specific fair launch.
 * @param launchId The ID of the fair launch.
 */
export function useGetFairLaunchData(launchId: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getFairLaunchData",
    args: [launchId],
    query: {
      enabled: !!launchId,
    },
  });
}

/**
 * Hook to read a user's commitment to a fair launch.
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
    },
  });
}

/**
 * Hook for the `commitToFairLaunch` write function.
 * This is a payable function used to commit funds to a token sale.
 */
export function useCommitToFairLaunch() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type CommitToFairLaunchArgs = {
    launchId: bigint;
    value: bigint; // For the payable amount (msg.value)
  };

  const commitToFairLaunch = (args: CommitToFairLaunchArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "commitToFairLaunch",
      args: [args.launchId],
      value: args.value,
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
 * Hook for the `sellTokens` write function on the MemedTokenSale contract.
 */
export function useSellTokens() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  type SellTokensArgs = {
    id: bigint;
    amount: bigint;
  };

  const sellTokens = (args: SellTokensArgs) => {
    writeContract({
      address: TOKEN_SALE_ADDRESS,
      abi: memedTokenSaleAbi,
      functionName: "sellTokens",
      args: [args.id, args.amount],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return { sellTokens, isPending, isConfirming, isConfirmed, hash, error };
}

/**
 * Hook to preview the amount of native token received for selling a given amount of tokens.
 * @param id The ID of the fair launch.
 * @param amount The amount of tokens to sell (as a bigint, in wei).
 */
export function useGetTokenToNativeToken(id: bigint, amount: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getTokenToNativeToken",
    args: [id, amount],
    query: {
      enabled: !!id && !!amount && amount > 0n,
    },
  });
}

/**
 * Hook to preview the amount of tokens received for a given amount of native token.
 * @param id The ID of the fair launch.
 * @param amount The amount of native token to spend (as a bigint, in wei).
 */
export function useGetNativeToTokenAmount(id: bigint, amount: bigint) {
  return useReadContract({
    address: TOKEN_SALE_ADDRESS,
    abi: memedTokenSaleAbi,
    functionName: "getNativeToTokenAmount",
    args: [id, amount],
    query: {
      enabled: !!id && !!amount && amount > 0n,
    },
  });
}
