
import React from "react";
import { Label } from "@/components/ui/label";

interface GradientPreviewProps {
  gradientValue: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ gradientValue }) => {
  return (
    <div className="mt-4">
      <Label className="block mb-2">Preview</Label>
      <div 
        className="h-16 rounded-md"
        style={{ backgroundImage: gradientValue }}
      ></div>
    </div>
  );
};

export default GradientPreview;
