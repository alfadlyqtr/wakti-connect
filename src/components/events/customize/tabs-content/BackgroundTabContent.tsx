
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

// Helper function to suggest a visual style based on event type
const suggestVisualStyle = (eventType: string): string => {
  switch (eventType) {
    case "wedding": return "elegant and romantic";
    case "birthday celebration": return "festive and colorful";
    case "conference": return "professional and clean";
    case "party": return "vibrant and energetic";
    case "dining event": return "warm and inviting";
    case "concert": return "dynamic and atmospheric";
    case "travel event": return "scenic and adventurous";
    case "graduation ceremony": return "formal and celebratory";
    case "outdoor nature event": return "natural and serene";
    default: return "polished and appropriate";
  }
};

// Helper function to suggest color palette based on event type
const suggestColorPalette = (eventType: string): string => {
  switch (eventType) {
    case "wedding": return "with soft pastel colors";
    case "birthday celebration": return "with bright, festive colors";
    case "conference": return "with professional blue and gray tones";
    case "party": return "with vibrant, high-energy colors";
    case "dining event": return "with warm amber and burgundy tones";
    case "concert": return "with dramatic contrasting colors";
    case "travel event": return "with natural earth tones and blues";
    case "graduation ceremony": return "with formal colors and gold accents";
    case "outdoor nature event": return "with earthy greens and natural tones";
    default: return "with balanced, harmonious colors";
  }
};

// Helper function to suggest mood/atmosphere based on event type
const suggestMood = (eventType: string): string => {
  switch (eventType) {
    case "wedding": return "romantic and celebratory";
    case "birthday celebration": return "joyful and festive";
    case "conference": return "professional and focused";
    case "party": return "exciting and social";
    case "dining event": return "inviting and appetizing";
    case "concert": return "energetic and immersive";
    case "travel event": return "inspiring and adventurous";
    case "graduation ceremony": return "proud and accomplished";
    case "outdoor nature event": return "peaceful and refreshing";
    default: return "engaging and appropriate";
  }
};

// Helper function to suggest composition based on event type
const suggestComposition = (eventType: string): string => {
  switch (eventType) {
    case "wedding": return "elegant floral arrangements or architectural details";
    case "birthday celebration": return "festive decorations and celebration elements";
    case "conference": return "abstract geometric patterns or blurred city skyline";
    case "party": return "dynamic abstract patterns with festive elements";
    case "dining event": return "soft-focus table settings or culinary elements";
    case "concert": return "dramatic lighting effects or musical elements";
    case "travel event": return "panoramic landscapes or iconic landmarks";
    case "graduation ceremony": return "academic symbolism with elegant framing";
    case "outdoor nature event": return "panoramic natural landscape with gentle depth of field";
    default: return "balanced composition with subtle visual interest";
  }
};

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

  // Enhanced AI background generation using sophisticated prompt construction
  const handleAIBackgroundGeneration = async () => {
    try {
      // Detect the event type from title and description
      const eventType = detectEventType(title, description);
      
      // Build a rich prompt with context about the event
      const visualStyle = suggestVisualStyle(eventType);
      const colorPalette = suggestColorPalette(eventType);
      const mood = suggestMood(eventType);
      const composition = suggestComposition(eventType);
      
      // Construct an enhanced prompt
      const enhancedPrompt = [
        `Create a ${visualStyle} background image for a ${eventType}`,
        title ? `titled "${title}"` : "",
        description ? `with theme: ${description}` : "",
        `The image should be ${mood}, ${colorPalette}, featuring ${composition}.`,
        "Make it suitable for an event invitation with space for text overlay."
      ].filter(Boolean).join(" ");
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a custom background for your event..."
      });
      
      console.log("Enhanced AI prompt:", enhancedPrompt);
      
      // Use the handleImageGeneration function with our enhanced prompt
      const result = await handleImageGeneration(enhancedPrompt);
      
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
