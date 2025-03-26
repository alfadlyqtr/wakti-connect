
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputsProps {
  colors: string[];
  onColorChange: (index: number, color: string) => void;
}

export const ColorInputs: React.FC<ColorInputsProps> = ({ colors, onColorChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {colors.map((color, index) => (
        <div key={index} className="space-y-1.5">
          <Label htmlFor={`gradient-color-${index}`} className="text-xs">
            Color {index + 1}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`gradient-color-${index}`}
              type="color"
              value={color}
              onChange={(e) => onColorChange(index, e.target.value)}
              className="w-10 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => onColorChange(index, e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
