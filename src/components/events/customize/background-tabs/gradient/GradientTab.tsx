
import React from "react";
import { GradientGenerator } from "@/components/ui/gradient-generator";
import { GradientTabProps } from "./types";

export const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
  direction,
  angle,
  onDirectionChange,
  onAngleChange,
}) => {
  return (
    <div className="space-y-4">
      <GradientGenerator
        value={value}
        onChange={onChange}
        angle={angle}
        direction={direction}
        onAngleChange={onAngleChange}
        onDirectionChange={onDirectionChange}
      />
    </div>
  );
};
