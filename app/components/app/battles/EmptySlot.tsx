import { useState } from "react";
import { Plus } from "lucide-react";

// Props interface for EmptySlot component
interface EmptySlotProps {
  onClick: () => void;
  label?: string;
}

/**
 * EmptySlot Component
 *
 * Displays an empty slot for token selection in battles.
 * Shows a dashed border with a plus icon and label.
 * Provides hover effects to indicate interactivity.
 *
 * @param onClick - Callback function when the slot is clicked
 * @param label - Optional custom label text (defaults to "Select meme to start Battle")
 */
export function EmptySlot({
  onClick,
  label = "Select meme to start Battle",
}: EmptySlotProps) {
  // Track hover state for visual feedback
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-sm bg-neutral-900 rounded-2xl border-4 border-neutral-800 border-dashed shadow-2xl">
      <div
        className="flex flex-col items-center justify-center py-32 px-8 cursor-pointer transition-all duration-200 hover:bg-neutral-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Plus icon in circle */}
        <div
          className={`w-16 h-16 rounded-full border-2 border-neutral-500 flex items-center justify-center mb-6 transition-all duration-200 ${
            isHovered ? "border-neutral-400 scale-105" : ""
          }`}
        >
          <Plus
            size={24}
            className={`text-neutral-500 transition-colors duration-200 ${
              isHovered ? "text-neutral-400" : ""
            }`}
          />
        </div>

        {/* Label text */}
        <p
          className={`text-neutral-500 text-base font-medium transition-colors duration-200 text-center ${
            isHovered ? "text-neutral-400" : ""
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
