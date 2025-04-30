
import React, { useState } from "react";
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

// Helper function to suggest keywords for the detected event type
const getEventKeywords = (eventType: string): string[] => {
  switch (eventType) {
    case "wedding":
      return ["romantic", "elegant", "floral", "celebration", "ceremonial", "love"];
    case "birthday celebration":
      return ["festive", "colorful", "joyful", "balloons", "celebration", "party"];
    case "conference":
      return ["professional", "business", "formal", "networking", "corporate"];
    case "party":
      return ["fun", "vibrant", "celebration", "festive", "lively", "energetic"];
    case "dining event":
      return ["culinary", "elegant", "gourmet", "cozy", "atmospheric", "food"];
    case "concert":
      return ["music", "excitement", "stage", "performance", "entertainment"];
    case "travel event":
      return ["scenic", "adventure", "exploration", "landscape", "journey"];
    case "graduation ceremony":
      return ["achievement", "academic", "formal", "celebration", "milestone"];
    case "outdoor nature event":
      return ["natural", "scenic", "peaceful", "lush", "organic", "greenery"];
    default:
      return ["professional", "appropriate", "engaging", "elegant"];
  }
};

// Create an optimized prompt specifically for Runware
const createRunwarePrompt = (eventType: string, title: string = "", description: string = ""): string => {
  const keywords = getEventKeywords(eventType);
  
  // Select random keywords (between 2-4) to avoid overwhelming the model
  const shuffled = [...keywords].sort(() => 0.5 - Math.random());
  const selectedKeywords = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
  
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
  
  // Create a concise, direct prompt with enough detail but not too verbose
  let prompt = `${basePrompt} ${selectedKeywords.join(", ")}.`;
  
  // Add title if available (but keep it short)
  if (title) {
    prompt += ` For event: "${title.substring(0, 30)}"`;
  }
  
  // Add a very brief mention of description if available
  if (description && description.length > 5) {
    const shortDesc = description.substring(0, 40);
    prompt += ` Theme: ${shortDesc}${shortDesc.length < description.length ? '...' : ''}`;
  }
  
  // Add specific instructions for Runware image generation
  prompt += " Perfect as event invitation background with space for text. Digital card format.";
  
  return prompt;
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

  // Enhanced AI background generation using optimized prompt construction
  const handleAIBackgroundGeneration = async (e?: React.MouseEvent) => {
    // Make sure to stop propagation if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      setIsGenerating(true);
      
      // Detect the event type from title and description
      const eventType = detectEventType(title, description);
      
      // Build an optimized prompt for Runware image generation
      const enhancedPrompt = createRunwarePrompt(eventType, title, description);
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a custom background for your event..."
      });
      
      console.log("Enhanced Runware prompt:", enhancedPrompt);
      
      // Use the handleImageGeneration function with our Runware-optimized prompt
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
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
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
