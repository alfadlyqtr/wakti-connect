
import React from "react";
import { useCustomization } from "../context";
import BackgroundSelector from "../BackgroundSelector";
import { BackgroundType } from "@/types/event.types";

interface BackgroundTabContentProps {
  title?: string;
  description?: string;
}

const BackgroundTabContent: React.FC<BackgroundTabContentProps> = ({ title, description }) => {
  const {
    customization,
    handleBackgroundChange,
    handleAnimationChange
  } = useCustomization();

  // Convert between type values used in UI and the internal values
  const convertBackgroundTypeToUI = (type: BackgroundType): "color" | "image" => {
    // Map 'solid' to 'color' for compatibility with BackgroundSelector component
    return type === 'solid' ? 'color' : 'image';
  };

  return (
    <BackgroundSelector
      backgroundType={convertBackgroundTypeToUI(customization.background.type)}
      backgroundValue={customization.background.value}
      onBackgroundChange={handleBackgroundChange}
      title={title}
      description={description}
    />
  );
};

export default BackgroundTabContent;
