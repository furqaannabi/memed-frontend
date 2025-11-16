import { Swords, Zap, Percent, Droplets } from "lucide-react";

const battleSystemData = {
  title: "6. Battle System Mechanics",
  points: [
    "Creators are required to stake 10M meme tokens to initiate a battle.",
    "Users can allocate their tokens into the battle. If they lose, their tokens are automatically swapped into the winning meme token by Uniswap.",
    "Battle outcome is calculated as 60% Lens engagement (Heat Score) + 40% allocated value.",
    "Winner receives the equivalent value in their own meme token as staking reward, 15% is burned, and 5% goes to platform fees.",
    "No central battle pool: all rewards are transferred directly with deflationary mechanics.",
  ],
};

export function BattleSystemSection() {
  return (
    <section className="py-12 md:py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            {battleSystemData.title}
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-lg border border-green-500/20">
              <ul className="space-y-4">
                {battleSystemData.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <Swords className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                <Zap className="mx-auto w-8 h-8 text-neutral-400 mb-2" />
                <p className="font-bold text-xl text-white">60%</p>
                <p className="text-sm text-neutral-300">Lens Engagement</p>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                <Percent className="mx-auto w-8 h-8 text-neutral-400 mb-2" />
                <p className="font-bold text-xl text-white">40%</p>
                <p className="text-sm text-neutral-300">Allocated Value</p>
              </div>
              <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
                <Droplets className="mx-auto w-8 h-8 text-red-400 mb-2" />
                <p className="font-bold text-xl text-white">15%</p>
                <p className="text-sm text-red-300">Burn on Win</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
