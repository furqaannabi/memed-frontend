import { useState } from "react";
import { TrendingUp, TrendingDown, CoinsIcon, Lightbulb } from "lucide-react";

const StakeForm = () => {
  const [stakeAmount, setStakeAmount] = useState("");

  return (
    <div className="bg-neutral-900 p-6 rounded-xl">
      <h2 className="text-white text-lg font-semibold mb-4 flex gap-2 items-center">
        <CoinsIcon className="text-green-500" /> Stake
      </h2>

      {/* APR Display */}
      <div className="text-center mb-6 bg-green-700/20 py-3 rounded-md">
        <div className="text-4xl font-bold text-green-400 mb-1">45%</div>
        <div className="text-sm text-neutral-400">Current APR</div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Total Staked</span>
          <span className="text-white">125,000 MEME</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Your Stake</span>
          <span className="text-green-500">2,500 MEME</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Next Reward</span>
          <span className="text-white">12 MEME</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Stake Amount</span>
        </div>
      </div>

      {/* Input */}
      <input
        type="number"
        placeholder="Enter MEME Amount"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
        className="w-full mb-4 p-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-0"
      />

      {/* Submit Button */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-2 rounded-md transition mb-4">
        Stake MEME
      </button>

      {/* Info Box */}
      <div className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm p-3 rounded-md ">
        <span className="flex items-center ">
          {" "}
          <Lightbulb size={20} /> Meme-Specific Staking
        </span>

        <span className="text-xs text-neutral-400">
          Earn higher rewards by staking on trending memes. APR increases with
          meme popularity!
        </span>
      </div>
    </div>
  );
};

export default StakeForm;
