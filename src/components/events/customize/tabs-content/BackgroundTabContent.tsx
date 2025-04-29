
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

  // Add the ability to handle AI generated backgrounds
  const handleAIBackgroundGeneration = async () => {
    // This would connect to an AI image generation service in a real implementation
    // For now, we'll just simulate it with a timeout and a placeholder image
    toast({
      title: "Generating background",
      description: "Please wait while we create a custom background for your event..."
    });
    
    // Simulate delay and then set a placeholder image
    setTimeout(() => {
      handleBackgroundChange('image', 'https://source.unsplash.com/random/800x600/?event');
      toast({
        title: "Background generated",
        description: "Your AI generated background has been applied"
      });
    }, 2000);
  };

  return (
    <>
      <BackgroundSelector
        backgroundType={convertBackgroundTypeToUI(customization.background.type)}
        backgroundValue={customization.background.value}
        onBackgroundChange={handleBackgroundChange}
        title={title}
        description={description}
        onGenerateAIBackground={handleAIBackgroundGeneration}
      />
    </>
  );
};

export default BackgroundTabContent;
