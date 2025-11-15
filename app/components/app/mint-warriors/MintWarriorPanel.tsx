import { useEffect } from "react";
import { Sword, CheckCircle } from "lucide-react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  useGetCurrentPrice,
  useGetMemedToken,
  useWarriorBalance,
  useMintWarrior,
} from "@/hooks/contracts/useWarriorNFT";
import {
  useMemedTokenBalance,
  useMemedTokenAllowance,
  useMemedTokenApprove,
} from "@/hooks/contracts/useMemedToken";

interface MintWarriorPanelProps {
  warriorNFTAddress: `0x${string}` | undefined;
  tokenName?: string;
}

/**
 * MintWarriorPanel Component
 *
 * Implements two-step minting flow:
 * 1. Approve: User approves warrior NFT contract to spend their claimed tokens
 * 2. Mint: User mints a warrior NFT (mintWarrior takes NO parameters!)
 *
 * Payment is in claimed tokens (MEME from fair launch), NOT payment token.
 * Price is dynamic and increases with each mint.
 */
export default function MintWarriorPanel({
  warriorNFTAddress,
  tokenName = "Warriors",
}: MintWarriorPanelProps) {
  const { address: userAddress } = useAccount();

  // Get current mint price from warrior NFT contract
  const {
    data: currentPrice,
    refetch: refetchPrice,
    error: priceError,
    isLoading: isPriceLoading,
  } = useGetCurrentPrice(warriorNFTAddress);

  // Get payment token address (claimed MEME tokens)
  const {
    data: paymentTokenAddress,
    error: tokenAddressError,
  } = useGetMemedToken(warriorNFTAddress);

  // Get user's claimed token balance
  const {
    data: userBalance,
    refetch: refetchBalance,
    error: balanceError,
  } = useMemedTokenBalance(paymentTokenAddress);

  // Get user's warrior NFT balance
  const {
    data: nftBalance,
    refetch: refetchNftBalance,
    error: nftBalanceError,
  } = useWarriorBalance(warriorNFTAddress, userAddress);

  // Check current allowance for warrior NFT contract
  const {
    data: allowance,
    refetch: refetchAllowance,
    error: allowanceError,
  } = useMemedTokenAllowance(paymentTokenAddress, warriorNFTAddress);

  // Approve hook
  const {
    approve,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    error: approveError,
  } = useMemedTokenApprove(paymentTokenAddress);

  // Mint hook
  const {
    mintWarrior,
    isPending: isMintPending,
    isConfirming: isMintConfirming,
    isConfirmed: isMintConfirmed,
    error: mintError,
  } = useMintWarrior(warriorNFTAddress);

  // Refetch data after approval confirmation
  useEffect(() => {
    if (isApproveConfirmed) {
      refetchAllowance();
    }
  }, [isApproveConfirmed, refetchAllowance]);

  // Refetch data after mint confirmation
  useEffect(() => {
    if (isMintConfirmed) {
      refetchPrice();
      refetchBalance();
      refetchNftBalance();
      refetchAllowance();
    }
  }, [
    isMintConfirmed,
    refetchPrice,
    refetchBalance,
    refetchNftBalance,
    refetchAllowance,
  ]);

  // Handle approve button click
  const handleApprove = () => {
    if (!warriorNFTAddress || !currentPrice) return;
    approve(warriorNFTAddress, currentPrice);
  };

  // Handle mint button click
  const handleMint = () => {
    mintWarrior();
  };

  // Check if user has enough balance
  const hasEnoughBalance =
    userBalance !== undefined &&
    currentPrice !== undefined &&
    userBalance >= currentPrice;

  // Check if user has approved enough allowance
  const hasEnoughAllowance =
    allowance !== undefined &&
    currentPrice !== undefined &&
    allowance >= currentPrice;

  return (
    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-white">
          Mint {tokenName} Warriors
        </h2>
      </div>

      {/* User's NFT Balance */}
      {nftBalance !== undefined && (
        <div className="bg-neutral-800 rounded-lg p-3 mb-4">
          <div className="text-sm text-neutral-400">Your Warriors</div>
          <div className="text-2xl font-bold text-white">
            {nftBalance.toString()}
          </div>
        </div>
      )}

      {/* Price Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Current Price:</span>
          <span className="text-white font-medium">
            {currentPrice
              ? `${formatEther(currentPrice)} ${tokenName}`
              : "Loading..."}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Your Balance:</span>
          <span className="text-white font-medium">
            {userBalance !== undefined
              ? `${formatEther(userBalance)} ${tokenName}`
              : "Loading..."}
          </span>
        </div>
        {!hasEnoughBalance && userBalance !== undefined && (
          <div className="text-red-400 text-sm">
            ⚠️ Insufficient balance to mint
          </div>
        )}
      </div>

      {/* Approve Success Message */}
      {isApproveConfirmed && !hasEnoughAllowance && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">
            Approval confirmed! Allowance will update shortly...
          </span>
        </div>
      )}

      {/* Mint Success Message */}
      {isMintConfirmed && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">
            Warrior minted successfully! Your balance will update shortly...
          </span>
        </div>
      )}

      {/* Error Messages */}
      {/* Combine read errors into one user-friendly message */}
      {(priceError || tokenAddressError || balanceError || nftBalanceError || allowanceError) && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
          ⚠️ Unable to load minting information. Please check your connection and try again.
        </div>
      )}

      {/* Write contract errors - simplified user-friendly messages */}
      {approveError && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {approveError.message.includes("rejected") || approveError.message.includes("denied")
            ? "❌ Transaction was cancelled"
            : approveError.message.includes("insufficient")
            ? "❌ Insufficient funds for transaction"
            : "❌ Approval failed. Please try again."}
        </div>
      )}
      {mintError && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {mintError.message.includes("rejected") || mintError.message.includes("denied")
            ? "❌ Transaction was cancelled"
            : mintError.message.includes("insufficient")
            ? "❌ Insufficient funds to mint"
            : "❌ Minting failed. Please try again."}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Show Approve button if allowance is insufficient */}
        {!hasEnoughAllowance && (
          <button
            onClick={handleApprove}
            disabled={
              !hasEnoughBalance ||
              isApprovePending ||
              isApproveConfirming ||
              !currentPrice
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isApprovePending || isApproveConfirming
              ? "Approving..."
              : `Approve ${currentPrice ? formatEther(currentPrice) : "..."} ${tokenName}`}
          </button>
        )}

        {/* Show Mint button if allowance is sufficient */}
        {hasEnoughAllowance && (
          <button
            onClick={handleMint}
            disabled={
              !hasEnoughBalance || isMintPending || isMintConfirming || !currentPrice
            }
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sword className="w-5 h-5" />
            {isMintPending || isMintConfirming
              ? "Minting..."
              : `Mint ${tokenName} Warrior`}
          </button>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-4 text-xs text-neutral-400">
        <p>
          💡 Minting requires two transactions: first approve token spending,
          then mint your warrior NFT.
        </p>
        <p className="mt-1">⚡ Price increases with each mint.</p>
      </div>
    </div>
  );
}
