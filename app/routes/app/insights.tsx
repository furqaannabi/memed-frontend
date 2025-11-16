import { useState } from "react";
import { Wallet, TrendingUp, Trophy, DollarSign } from "lucide-react";
import BattleHistory from "@/components/app/meme/BattleHistory";

export default function MyInsights() {
  const [walletData] = useState({
    memeBalance: { amount: 1337, value: 5.67 },
    stakedMeme: { amount: 420, value: 5.67 },
    pendingRewards: { amount: 111, value: 5.67 },
  });

  const [performanceData] = useState({
    heatScore: 6969,
    battlesWon: 12,
    battlesLost: 3,
    winRate: "80%",
    totalWinning: "888 MEME",
  });

  const [battleHistory] = useState([
    { opponent: "@paperhands", daysAgo: 2, reward: "+100 MEME", won: true },
    { opponent: "@ngmi", daysAgo: 2, reward: "+70 MEME", won: true },
  ]);

  const [stakedItems] = useState([
    { name: "Meme 1", amount: "500 GHO", phase: "reveal", status: "committed" },
    { name: "250 GHO", phase: "complete", status: "revealed" },
  ]);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Insights</h1>
          <p className="text-gray-400">
            Track your MEME journey and performance
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Wallet Overview */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-white">
                  Wallet Overview
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    1337
                  </div>
                  <div className="text-sm text-gray-400 mb-1">Meme Balance</div>
                  <div className="text-xs text-green-500">≈ $5.67</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-300 mb-1">
                    420
                  </div>
                  <div className="text-sm text-gray-400 mb-1">Staked MEME</div>
                  <div className="text-xs text-neutral-400">≈ $5.67</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">111</div>
                  <div className="text-sm text-gray-400 mb-1">
                    Pending Rewards
                  </div>
                  <div className="text-xs text-white">≈ $5.67</div>
                </div>
              </div>
            </div>

            <BattleHistory />
            {/* Staked Section */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Staked</h2>

              <div className="space-y-4">
                {stakedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {item.name}
                        {item.amount && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-white">{item.amount}</span>
                          </>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.phase && `phase: ${item.phase}`}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "committed"
                          ? "bg-yellow-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Performance */}
          <div>
            <div className="bg-neutral-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-neutral-400" />
                <h2 className="text-xl font-semibold text-white">
                  Performance
                </h2>
              </div>

              {/* Heat Score under heading */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">6969</div>
                <div className="text-sm text-gray-400">Heat Score</div>
              </div>

              {/* Statistics table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Battles Won</span>
                  <span className="text-green-500 font-semibold text-xl">
                    12
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Battles Lost</span>
                  <span className="text-red-500 font-semibold text-xl">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Win Rate</span>
                  <span className="text-white font-semibold text-xl">
                    80%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Winning</span>
                  <span className="text-white font-semibold">888 MEME</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
