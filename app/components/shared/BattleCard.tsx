import { useState } from "react";
import { FlameIcon } from "lucide-react";

interface BattleCardProps {
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
  leftViews: string;
  rightViews: string;
  leftPercentage: number; // 0-100, winning percentage for left side
  rightPercentage: number; // 0-100, winning percentage for right side
}

export const BattleCard = ({
  leftImage,
  rightImage,
  leftLabel,
  rightLabel,
  leftViews,
  rightViews,
  leftPercentage,
  rightPercentage,
}: BattleCardProps) => {
  // Track loading state for each image
  const [leftImageLoaded, setLeftImageLoaded] = useState(false);
  const [rightImageLoaded, setRightImageLoaded] = useState(false);

  return (
    <div className="flex flex-col  gap-4 bg-neutral-800 pb-2 ">
      <div className="  overflow-hidden flex   justify-between w-full relative">
        {/* Left image with loading skeleton */}
        <div className="relative w-1/2  overflow-hidden">
          {/* Loading skeleton - shown while image loads */}
          {!leftImageLoaded && (
            <div
              className="absolute inset-0 bg-neutral-700 animate-pulse"
              style={{
                clipPath: "polygon(0 0, 100% 0%, 85% 100%, 0% 100%)",
              }}
            />
          )}
          {/* Image with loading state tracking */}
          {leftImage && (
            <img
              src={leftImage}
              alt={leftLabel}
              className="w-full h-full object-cover"
              style={{
                clipPath: "polygon(0 0, 100% 0%, 85% 100%, 0% 100%)",
              }}
              onLoad={() => setLeftImageLoaded(true)}
              onError={(e) => {
                // Keep skeleton showing on error
                setLeftImageLoaded(false);
              }}
            />
          )}
        </div>

        {/* Right image with loading skeleton */}
        <div className="relative w-1/2 overflow-hidden">
          {/* Loading skeleton - shown while image loads */}
          {!rightImageLoaded && (
            <div
              className="absolute inset-0 bg-neutral-700 animate-pulse"
              style={{
                clipPath: "polygon(15% 0, 100% 0%, 100% 100%, 0% 100%)",
              }}
            />
          )}
          {/* Image with loading state tracking */}
          {rightImage && (
            <img
              src={rightImage}
              alt={rightLabel}
              className="w-full h-full object-cover"
              style={{
                clipPath: "polygon(15% 0, 100% 0%, 100% 100%, 0% 100%)",
              }}
              onLoad={() => setRightImageLoaded(true)}
              onError={(e) => {
                // Keep skeleton showing on error
                setRightImageLoaded(false);
              }}
            />
          )}
        </div>
      </div>
      {/* Bottom overlay content container */}
      <div className=" px-1 flex justify-between items-center text-sm text-white text-opacity-80 font-semibold pointer-events-none">
        <span>
          {leftLabel}
          <br />
          <span className=" flex items-center gap-1 text-xs">
            <FlameIcon size={12} className="text-orange-500" /> {leftViews}{" "}
            {/* Show leading badge only if left side has higher percentage */}
            {leftPercentage > rightPercentage && (
              <span className="bg-green-700/50 text-green-500 px-1  text-[10px] rounded-full ml-1">
                leading
              </span>
            )}
          </span>
        </span>
        <span className="text-right">
          {rightLabel}
          <br />
          <span className="flex items-center gap-1 text-xs">
            <FlameIcon size={12} className="text-orange-500" />
            {rightViews}
            {/* Show leading badge only if right side has higher percentage */}
            {rightPercentage > leftPercentage && (
              <span className="bg-orange-700/50 text-orange-500 px-1  text-[10px] rounded-full ml-1">
                leading
              </span>
            )}
          </span>
        </span>
      </div>

      {/* Dynamic Progress bar - split design showing battle scores */}
      <div className="w-full px-1">
        <div className="h-2 bg-gradient-to-r from-green-500/30 to-orange-500/30 rounded-full overflow-hidden flex">
          {/* Left side (green) - Meme A percentage */}
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
            style={{ width: `${leftPercentage}%` }}
          />
          {/* Right side (orange) - Meme B percentage */}
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500"
            style={{ width: `${rightPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
