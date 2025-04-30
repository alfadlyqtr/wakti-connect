
import React, { useState, useCallback } from "react";
import { useCustomization } from "../context";
import BackgroundSelector from "../BackgroundSelector";
import { BackgroundType } from "@/types/event.types";
import { toast } from "@/components/ui/use-toast";
import { handleImageGeneration } from "@/hooks/ai/utils/imageHandling";

interface BackgroundTabContentProps {
  title?: string;
  description?: string;
}

// Helper function to detect event type based on title and description
const detectEventType = (title: string = "", description: string = ""): string => {
  const text = (title + " " + description).toLowerCase();
  
  // Check for common event types
  if (/wedding|marriage|bride|groom|ceremony|reception/.test(text)) return "wedding";
  if (/birthday|bday|celebrate|anniversary/.test(text)) return "birthday celebration";
  if (/conference|seminar|workshop|meeting|webinar|lecture/.test(text)) return "conference";
  if (/party|celebration|fest|festival/.test(text)) return "party";
  if (/dinner|lunch|breakfast|brunch|meal|food|restaurant|cafe/.test(text)) return "dining event";
  if (/concert|music|performance|show|gig|band|artist|tour/.test(text)) return "concert";
  if (/travel|trip|journey|vacation|tour|visit|exploring/.test(text)) return "travel event";
  if (/graduation|commencement|diploma|degree|graduate/.test(text)) return "graduation ceremony";
  if (/farm|nature|outdoor|garden|park|field|agriculture/.test(text)) return "outdoor nature event";
  
  // Default fallback
  return "event";
};

// Create an optimized prompt specifically for Runware
const createRunwarePrompt = (eventType: string, title: string = "", description: string = ""): string => {
  // Base prompts optimized for Runware
  let basePrompt = "";
  
  switch (eventType) {
    case "outdoor nature event":
      basePrompt = "Beautiful scenic landscape with natural elements for a digital card, 5.78\" x 2.82\".";
      break;
    case "wedding":
      basePrompt = "Elegant wedding scene with soft romantic atmosphere for a digital card, 5.78\" x 2.82\".";
      break;
    case "birthday celebration":
      basePrompt = "Festive birthday celebration background with vibrant colors for a digital card, 5.78\" x 2.82\".";
      break;
    case "conference":
      basePrompt = "Professional conference or business meeting setting for a digital card, 5.78\" x 2.82\".";
      break;
    case "party":
      basePrompt = "Festive party atmosphere with dynamic lighting for a digital card, 5.78\" x 2.82\".";
      break;
    case "dining event":
      basePrompt = "Elegant dining atmosphere with warm ambient lighting for a digital card, 5.78\" x 2.82\".";
      break;
    case "concert":
      basePrompt = "Concert venue with atmospheric lighting and stage elements for a digital card, 5.78\" x 2.82\".";
      break;
    case "travel event":
      basePrompt = "Beautiful destination landscape with scenic views for a digital card, 5.78\" x 2.82\".";
      break;
    case "graduation ceremony":
      basePrompt = "Formal graduation ceremony with academic elements for a digital card, 5.78\" x 2.82\".";
      break;
    default:
      basePrompt = "Elegant event background with professional aesthetic for a digital card, 5.78\" x 2.82\".";
  }
  
  // Add title if available
  if (title) {
    basePrompt += ` For event: "${title.substring(0, 30)}"`;
  }
  
  // Add a very brief mention of description if available
  if (description && description.length > 5) {
    const shortDesc = description.substring(0, 40);
    basePrompt += ` Theme: ${shortDesc}${shortDesc.length < description.length ? '...' : ''}`;
  }
  
  // Add specific instructions for card background
  basePrompt += " Digital invitation card background, landscape orientation, wide format with space for text overlay.";
  
  return basePrompt;
}

const BackgroundTabContent: React.FC<BackgroundTabContentProps> = ({ title, description }) => {
  const {
    customization,
    handleBackgroundChange
  } = useCustomization();

  const [isGenerating, setIsGenerating] = useState(false);

  // Convert between type values used in UI and the internal values
  const convertBackgroundTypeToUI = (type: BackgroundType): "color" | "image" => {
    // Map 'solid' to 'color' for compatibility with BackgroundSelector component
    return type === 'solid' ? 'color' : 'image';
  };

  // Enhanced AI background generation with proper error handling and state management
  const handleAIBackgroundGeneration = useCallback(async (e?: React.MouseEvent) => {
    // Make sure to stop propagation if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Extra insurance against event bubbling
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    
    try {
      // Show generating state
      setIsGenerating(true);
      
      // Detect the event type from title and description
      const eventType = detectEventType(title, description);
      
      // Build an optimized prompt for Runware image generation
      const enhancedPrompt = createRunwarePrompt(eventType, title, description);
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a background for your event..."
      });
      
      console.log("Enhanced Runware prompt:", enhancedPrompt);
      
      // Call the image generation with Runware-optimized settings
      const result = await handleImageGeneration(enhancedPrompt);
      
      if (result.success && result.imageUrl) {
        // Update the background with the generated image
        console.log("Applying background image:", result.imageUrl);
        handleBackgroundChange('image', result.imageUrl);
        
        toast({
          title: "Background generated",
          description: "Your AI generated background has been applied"
        });
      } else {
        console.error("Failed to generate image:", result.error);
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("AI background generation failed:", error);
      
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate image background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [title, description, handleBackgroundChange]);

  // Universal event stopper
  const stopPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return (
    <div 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <BackgroundSelector
        backgroundType={convertBackgroundTypeToUI(customization.background.type)}
        backgroundValue={customization.background.value}
        onBackgroundChange={handleBackgroundChange}
        title={title}
        description={description}
        onGenerateAIBackground={handleAIBackgroundGeneration}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default BackgroundTabContent;
