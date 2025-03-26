
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorInputsProps {
  color1: string;
  color2: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
}

const ColorInputs: React.FC<ColorInputsProps> = ({
  color1,
  color2,
  onColor1Change,
  onColor2Change
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="color1" className="block mb-2">Start Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id="color1"
            value={color1}
            onChange={(e) => onColor1Change(e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={color1}
            onChange={(e) => onColor1Change(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="color2" className="block mb-2">End Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id="color2"
            value={color2}
            onChange={(e) => onColor2Change(e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={color2}
            onChange={(e) => onColor2Change(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorInputs;
