
import React from "react";
import { Label } from "@/components/ui/label";
import { GradientDirection } from "./types";

interface DirectionButtonsProps {
  directions: GradientDirection[];
  currentDirection: string;
  onDirectionChange: (direction: string) => void;
}

const DirectionButtons: React.FC<DirectionButtonsProps> = ({
  directions,
  currentDirection,
  onDirectionChange
}) => {
  const handleClick = (direction: string) => {
    console.log("Direction button clicked:", direction);
    onDirectionChange(direction);
  };

  return (
    <div>
      <Label className="block mb-2">Direction</Label>
      <div className="grid grid-cols-4 gap-2">
        {directions.map((dir) => (
          <button
            key={dir.value}
            type="button"
            onClick={() => handleClick(dir.value)}
            className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
              currentDirection === dir.value 
                ? 'bg-primary/10 border-primary' 
                : 'border-border hover:bg-accent/50'
            }`}
            aria-pressed={currentDirection === dir.value}
          >
            <span className="text-xl">{dir.icon}</span>
            <span className="text-xs mt-1">{dir.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DirectionButtons;
