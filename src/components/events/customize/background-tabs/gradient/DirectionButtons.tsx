
import React from "react";
import { DIRECTIONS } from "./constants";
import { Button } from "@/components/ui/button";
import { GradientDirection } from "./types";

interface DirectionButtonsProps {
  selectedDirection: string;
  onDirectionChange: (direction: string) => void;
}

export const DirectionButtons: React.FC<DirectionButtonsProps> = ({
  selectedDirection,
  onDirectionChange,
}) => {
  return (
    <div className="space-y-2 mb-4">
      <h4 className="text-sm font-medium">Direction</h4>
      <div className="grid grid-cols-4 gap-2">
        {DIRECTIONS.map((direction: GradientDirection) => (
          <Button
            key={direction.value}
            variant={selectedDirection === direction.value ? "default" : "outline"}
            size="sm"
            onClick={() => onDirectionChange(direction.value)}
            className="h-9 px-0"
          >
            {direction.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
