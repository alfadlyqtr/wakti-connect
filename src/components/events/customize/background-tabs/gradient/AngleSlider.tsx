
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AngleSliderProps {
  angle: number;
  onAngleChange: (angle: number) => void;
}

const AngleSlider: React.FC<AngleSliderProps> = ({ angle, onAngleChange }) => {
  return (
    <div>
      <Label htmlFor="angle" className="block mb-2">Angle: {angle}°</Label>
      <Slider
        id="angle"
        min={0}
        max={360}
        step={1}
        value={[angle]}
        onValueChange={(values) => onAngleChange(values[0])}
        className="py-4"
      />
    </div>
  );
};

export default AngleSlider;
