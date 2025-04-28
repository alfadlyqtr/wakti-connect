
import React from "react";
import { GradientGenerator } from "@/components/ui/gradient-generator";
import { GradientTabProps } from "./types";

export const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
}) => {
  const handleGradientChange = (gradient: string) => {
    onChange(gradient);
  };

  return (
    <div className="space-y-4">
      <GradientGenerator 
        value={value} 
        onChange={handleGradientChange}
      />
    </div>
  );
};
