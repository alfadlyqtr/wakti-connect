
import React from "react";
import { Image } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";

export const ImageAnalysisToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Image}
      title="Image Analysis"
      description="Upload an image to analyze its content and extract information"
      iconColor="text-green-500"
    >
      <Button disabled className="w-full">
        Coming Soon
      </Button>
    </AIToolCard>
  );
};
