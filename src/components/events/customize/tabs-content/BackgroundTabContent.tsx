
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

// Create a direct, concise prompt that works well with AI image generation
const createOptimizedPrompt = (eventType: string, title: string = "", description: string = ""): string => {
  const keywords = getEventKeywords(eventType);
  
  // Select random keywords (between 2-4) to avoid overwhelming the model
  const shuffled = [...keywords].sort(() => 0.5 - Math.random());
  const selectedKeywords = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Base prompts optimized for different event types
  let basePrompt = "";
  
  switch (eventType) {
    case "outdoor nature event":
      basePrompt = "Beautiful scenic landscape with natural elements.";
      break;
    case "wedding":
      basePrompt = "Elegant wedding scene with soft romantic atmosphere.";
      break;
    case "birthday celebration":
      basePrompt = "Festive birthday celebration background with vibrant colors.";
      break;
    case "conference":
      basePrompt = "Professional conference or business meeting setting.";
      break;
    case "party":
      basePrompt = "Festive party atmosphere with dynamic lighting.";
      break;
    case "dining event":
      basePrompt = "Elegant dining atmosphere with warm ambient lighting.";
      break;
    case "concert":
      basePrompt = "Concert venue with atmospheric lighting and stage elements.";
      break;
    case "travel event":
      basePrompt = "Beautiful destination landscape with scenic views.";
      break;
    case "graduation ceremony":
      basePrompt = "Formal graduation ceremony with academic elements.";
      break;
    default:
      basePrompt = "Elegant event background with professional aesthetic.";
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
  
  // Add specific instructions for image generation
  prompt += " Perfect as event invitation background with space for text.";
  
  return prompt;
};

const BackgroundTabContent: React.FC<BackgroundTabContentProps> = ({ title, description }) => {
  const {
    customization,
    handleBackgroundChange,
    handleAnimationChange
  } = useCustomization();
  
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Convert between type values used in UI and the internal values
  const convertBackgroundTypeToUI = (type: BackgroundType): "color" | "image" => {
    // Map 'solid' to 'color' for compatibility with BackgroundSelector component
    return type === 'solid' ? 'color' : 'image';
  };

  // Enhanced AI background generation using optimized prompt construction
  const handleAIBackgroundGeneration = async (customPrompt?: string) => {
    try {
      setIsGeneratingImage(true);
      
      // Use the provided custom prompt if available
      let enhancedPrompt;
      
      if (customPrompt) {
        // Use custom prompt directly
        enhancedPrompt = customPrompt;
        console.log("Using custom prompt for AI generation:", customPrompt);
      } else {
        // Detect the event type from title and description
        const eventType = detectEventType(title, description);
        
        // Build an optimized prompt for image generation
        enhancedPrompt = createOptimizedPrompt(eventType, title, description);
        console.log("Using auto-generated prompt for AI:", enhancedPrompt);
      }
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a custom background for your event..."
      });
      
      // Use the handleImageGeneration function with our enhanced prompt
      const result = await handleImageGeneration(enhancedPrompt);
      
      if (result.success && result.imageUrl) {
        // Update the background with the generated image
        handleBackgroundChange('image', result.imageUrl);
        
        toast({
          title: "Background generated",
          description: customPrompt ? 
            "Your custom AI background has been applied" : 
            "Your AI generated background has been applied"
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
    } finally {
      setIsGeneratingImage(false);
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
        isGeneratingImage={isGeneratingImage}
      />
    </>
  );
};

export default BackgroundTabContent;
