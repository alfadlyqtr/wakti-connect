
import React, { useState, useEffect } from "react";
import { DirectionButtons } from "./DirectionButtons";
import { AngleSlider } from "./AngleSlider";
import { ColorInputs } from "./ColorInputs";
import { GradientPreview } from "./GradientPreview";
import { GradientPresets } from "./GradientPresets";
import { DEFAULT_GRADIENT } from "./constants";
import { GradientTabProps } from "./types";
import { GradientGenerator } from "@/components/ui/gradient-generator";

export const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
  direction = DEFAULT_GRADIENT.direction,
  onDirectionChange,
  angle = DEFAULT_GRADIENT.angle,
  onAngleChange,
}) => {
  // Instead of implementing our own gradient system,
  // we'll use the GradientGenerator component
  // and listen to its changes

  useEffect(() => {
    if (value) {
      // If we received a value from parent, we'll use it
      onChange(value);
    }
  }, [value]);

  const handleGradientChange = (newGradient: string) => {
    onChange(newGradient);
  };

  return (
    <div>
      <GradientGenerator />
    </div>
  );
};
