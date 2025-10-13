import { useState, useEffect } from "react";
import {
  useSellTokens,
  useGetTokenToNativeToken,
  useGetNativeToTokenAmount,
} from "@/hooks/contracts/useMemedTokenSale";
import { parseEther, formatEther } from "viem";

// Custom hook for debouncing a value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function TradeForm() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [buyAmount, setBuyAmount] = useState(""); // Amount of GHO to pay
  const [sellAmount, setSellAmount] = useState(""); // Amount of MEME to sell
  const [receiveAmount, setReceiveAmount] = useState("");

  // Debounce the input amounts to avoid excessive hook calls
  const debouncedBuyAmount = useDebounce(buyAmount, 500);
  const debouncedSellAmount = useDebounce(sellAmount, 500);

  // Convert debounced amounts to bigint for the hooks
  const buyAmountAsBigInt = debouncedBuyAmount
    ? parseEther(debouncedBuyAmount as `${number}`)
    : 0n;
  const sellAmountAsBigInt = debouncedSellAmount
    ? parseEther(debouncedSellAmount as `${number}`)
    : 0n;

  // --- Contract Hooks ---
  const { sellTokens, isPending, isConfirming } = useSellTokens();

  // Hook for calculating buy preview
  const { data: buyPreviewAmount, isLoading: isLoadingBuyPreview } =
    useGetNativeToTokenAmount(1n, buyAmountAsBigInt);

  // Hook for calculating sell preview
  const {
    data: sellPreviewAmount,
    isLoading: isLoadingSellPreview,
    error,
  } = useGetTokenToNativeToken(1n, sellAmountAsBigInt);
  console.log(error);
  // --- Effects ---

  // Update receive amount when buy preview data changes
  useEffect(() => {
    if (mode === "buy" && buyPreviewAmount) {
      setReceiveAmount(formatEther(buyPreviewAmount));
    }
  }, [buyPreviewAmount, mode]);

  // Update receive amount when sell preview data changes
  useEffect(() => {
    if (mode === "sell" && sellPreviewAmount) {
      setReceiveAmount(formatEther(sellPreviewAmount));
    }
  }, [sellPreviewAmount, mode]);

  // --- Handlers ---

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellAmount || parseFloat(sellAmount) <= 0) return;
    sellTokens({ id: 1n, amount: sellAmountAsBigInt });
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Buy functionality not yet implemented.");
  };

  // --- Render Logic ---

  const isLoadingTx = isPending || isConfirming;
  const isAmountInvalid =
    mode === "buy"
      ? !buyAmount || parseFloat(buyAmount) <= 0
      : !sellAmount || parseFloat(sellAmount) <= 0;

  return (
    <form
      onSubmit={mode === "buy" ? handleBuySubmit : handleSellSubmit}
      className="w-full mx-auto rounded-xl bg-neutral-900 p-4 sm:p-6 text-white space-y-4"
    >
      <h2 className="text-lg font-semibold">Trade MEME</h2>

      <div className="flex bg-neutral-800 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setMode("buy")}
          className={`w-1/2 py-2 font-medium cursor-pointer ${mode === "buy" ? "bg-green-700/20 text-green-400" : "text-white"}`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setMode("sell")}
          className={`w-1/2 py-2 font-medium cursor-pointer ${mode === "sell" ? "bg-red-700/20 text-red-400" : "text-white"}`}
        >
          Sell
        </button>
      </div>

      {mode === "buy" ? (
        <>
          <div>
            <label className="block text-sm mb-1">Pay With GHO</label>
            <input
              type="number"
              placeholder="0.00 GHO"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 rounded-lg placeholder-neutral-400 text-sm"
            />
          </div>
          <div className="text-center text-2xl text-neutral-400">↓</div>
          <div>
            <label className="block text-sm mb-1">Receive MEME</label>
            <input
              type="number"
              placeholder={isLoadingBuyPreview ? "Calculating..." : "0.00"}
              value={receiveAmount}
              disabled
              className="w-full px-4 py-3 bg-neutral-800 rounded-lg placeholder-neutral-400 text-sm"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm mb-1">Sell MEME</label>
            <input
              type="number"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 rounded-lg placeholder-neutral-400 text-sm"
            />
          </div>
          <div className="text-center text-2xl text-neutral-400">↓</div>
          <div>
            <label className="block text-sm mb-1">Receive GHO</label>
            <input
              type="number"
              placeholder={isLoadingSellPreview ? "Calculating..." : "0.00 GHO"}
              value={receiveAmount}
              disabled
              className="w-full px-4 py-3 bg-neutral-800 rounded-lg placeholder-neutral-400 text-sm"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoadingTx || isAmountInvalid}
        className="w-full py-3 cursor-pointer rounded-lg text-sm font-semibold bg-green-400 text-black hover:bg-green-600 transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
      >
        {isLoadingTx
          ? "Processing..."
          : mode === "buy"
            ? "Buy MEME"
            : "Sell MEME"}
      </button>
    </form>
  );
}
