interface LeaderboardCardProps {
  item: {
    id: string | number; // Allow both string and number to handle different token ID types
    rank: number;
    name: string;
    username: string;
    image: string;
    score: number;
    engagement: string;
  };
}

export function LeaderboardCard({ item }: LeaderboardCardProps) {
  return (
    <div className="rounded-xl p-2 sm:p-3 md:p-4 hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-800">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
        />
        <div className="w-full overflow-hidden">
          <div className="text-white text-sm sm:text-base font-bold">
            #{item.rank}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-white text-sm sm:text-base truncate"
                title={item.name}
              >
                {item.name}
              </h3>
              <p
                className="text-gray-400 text-xs sm:text-sm truncate"
                title={item.username}
              >
                {item.username}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
              <div className="text-orange-500 font-bold text-sm sm:text-base">
                {item.score.toLocaleString()}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">
                {item.engagement} engagement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
