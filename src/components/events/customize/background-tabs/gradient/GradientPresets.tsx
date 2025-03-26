
import React from "react";
import { GRADIENT_PRESETS } from "./constants";

interface GradientPresetsProps {
  onPresetClick: (preset: string) => void;
}

export const GradientPresets: React.FC<GradientPresetsProps> = ({ onPresetClick }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Presets</h4>
      <div className="grid grid-cols-4 gap-2">
        {GRADIENT_PRESETS.map((preset, index) => (
          <button
            key={index}
            className="h-12 w-full rounded-md border shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: preset.value }}
            onClick={() => onPresetClick(preset.value)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};
