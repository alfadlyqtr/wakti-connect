
import React from "react";
import { Camera } from "lucide-react";
import { AIToolCard } from "./AIToolCard";

export const ImageAnalysisToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Camera}
      title="Image Analysis"
      description="Take photos or upload images for the AI to analyze."
      iconColor="text-green-600"
    >
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Click to take a photo or upload an image</p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, or GIF up to 10MB
        </p>
      </div>
    </AIToolCard>
  );
};
