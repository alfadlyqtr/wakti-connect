
import React from "react";

interface GradientPreviewProps {
  gradient: string;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({ gradient }) => {
  return (
    <div className="mb-4">
      <div 
        className="h-20 w-full rounded-md shadow-sm" 
        style={{ background: gradient }}
      ></div>
    </div>
  );
};
