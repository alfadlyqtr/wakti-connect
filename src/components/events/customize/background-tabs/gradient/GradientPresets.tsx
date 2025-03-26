
import React from "react";
import { Label } from "@/components/ui/label";
import { GradientPreset } from "./types";

interface GradientPresetsProps {
  presets: GradientPreset[];
  currentValue: string;
  onPresetSelect: (preset: string) => void;
}

const GradientPresets: React.FC<GradientPresetsProps> = ({
  presets,
  currentValue,
  onPresetSelect
}) => {
  return (
    <div>
      <Label className="block mb-2">Gradient Presets</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            className={`h-12 rounded-md border ${
              currentValue === preset.value ? 'ring-2 ring-primary' : ''
            }`}
            style={{ backgroundImage: preset.value }}
            onClick={() => onPresetSelect(preset.value)}
            aria-label={`Gradient preset ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GradientPresets;
