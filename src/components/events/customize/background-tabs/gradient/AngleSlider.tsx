
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AngleSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const AngleSlider: React.FC<AngleSliderProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="angle" className="block mb-2">Angle: {value}°</Label>
      <Slider
        id="angle"
        min={0}
        max={360}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="py-4"
      />
    </div>
  );
};

export default AngleSlider;
