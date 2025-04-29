
import React from "react";
import { useCustomization } from "../context";
import BackgroundSelector from "../BackgroundSelector";
import { BackgroundType } from "@/types/event.types";
import { toast } from "@/components/ui/use-toast";
import { handleImageGeneration } from "@/hooks/ai/utils/imageHandling";

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

  // Add the ability to handle AI generated backgrounds using WAKTI AI system
  const handleAIBackgroundGeneration = async () => {
    try {
      // Generate prompt based on the event title and description
      const prompt = `Create a beautiful event background image${title ? ` for "${title}"` : ''}${description ? ` with theme: ${description}` : ''}`;
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a custom background for your event..."
      });
      
      // Use the same handleImageGeneration function that WAKTI AI uses
      const result = await handleImageGeneration(prompt);
      
      if (result.success && result.imageUrl) {
        // Update the background with the generated image
        handleBackgroundChange('image', result.imageUrl);
        
        toast({
          title: "Background generated",
          description: "Your AI generated background has been applied"
        });
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("AI background generation failed:", error);
      
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate image background. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to a placeholder image when AI generation fails
      handleBackgroundChange('image', 'https://source.unsplash.com/random/800x600/?event');
    }
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
