
import { runwareService } from '@/services/ai/runwareService';
import { toast } from '@/components/ui/use-toast';

export interface GeneratedBackgroundResult {
  imageUrl: string;
  prompt: string;
  success: boolean;
  error?: string;
  provider?: string;
}

// Detect event type based on title and description
const detectEventType = (title: string = "", description: string = ""): string => {
  const text = (title + " " + description).toLowerCase();
  
  if (/wedding|marriage|bride|groom|ceremony|reception/.test(text)) return "wedding";
  if (/birthday|bday|celebrate|anniversary/.test(text)) return "birthday celebration";
  if (/conference|seminar|workshop|meeting|webinar|lecture/.test(text)) return "conference";
  if (/party|celebration|fest|festival/.test(text)) return "party";
  if (/dinner|lunch|breakfast|brunch|meal|food|restaurant|cafe/.test(text)) return "dining event";
  if (/concert|music|performance|show|gig|band|artist|tour/.test(text)) return "concert";
  if (/travel|trip|journey|vacation|tour|visit|exploring/.test(text)) return "travel event";
  if (/graduation|commencement|diploma|degree|graduate/.test(text)) return "graduation ceremony";
  if (/farm|nature|outdoor|garden|park|field|agriculture/.test(text)) return "outdoor nature event";
  
  return "event";
};

// Create an optimized prompt specifically for Runware for event backgrounds
export const createBackgroundPrompt = (eventType: string, title: string = "", description: string = ""): string => {
  let basePrompt = "";
  
  // Customize prompt based on event type
  switch (eventType) {
    case "outdoor nature event":
      basePrompt = "Beautiful scenic landscape with natural elements for a digital invitation card.";
      break;
    case "wedding":
      basePrompt = "Elegant wedding scene with soft romantic atmosphere for a digital invitation card.";
      break;
    case "birthday celebration":
      basePrompt = "Festive birthday celebration background with vibrant colors for a digital invitation card.";
      break;
    case "conference":
      basePrompt = "Professional conference or business meeting setting for a digital invitation card.";
      break;
    case "party":
      basePrompt = "Festive party atmosphere with dynamic lighting for a digital invitation card.";
      break;
    case "dining event":
      basePrompt = "Elegant dining atmosphere with warm ambient lighting for a digital invitation card.";
      break;
    case "concert":
      basePrompt = "Concert venue with atmospheric lighting and stage elements for a digital invitation card.";
      break;
    case "travel event":
      basePrompt = "Beautiful destination landscape with scenic views for a digital invitation card.";
      break;
    case "graduation ceremony":
      basePrompt = "Formal graduation ceremony with academic elements for a digital invitation card.";
      break;
    default:
      basePrompt = "Elegant event background with professional aesthetic for a digital invitation card.";
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
  basePrompt += " Generate an invitation card background in landscape orientation, wide format (5.78\" × 2.82\"), with space for text overlay.";
  
  return basePrompt;
};

// Generate an event background using Runware
export async function generateEventBackground(
  title: string, 
  description: string
): Promise<GeneratedBackgroundResult> {
  try {
    console.log('[eventBackgroundGenerator] Starting image generation with info:', { title, description });
    
    // Detect event type and create optimized prompt
    const eventType = detectEventType(title, description);
    const prompt = createBackgroundPrompt(eventType, title, description);
    
    console.log('[eventBackgroundGenerator] Using prompt:', prompt);
    
    // Generate image with Runware-optimized settings
    const result = await runwareService.generateImage({
      positivePrompt: prompt,
      model: "runware:100@1",
      CFGScale: 12.0,
      scheduler: "FlowMatchEulerDiscreteScheduler",
      strength: 0.9
    });
    
    console.log('[eventBackgroundGenerator] Image generation successful:', result.imageURL);
    
    return {
      imageUrl: result.imageURL,
      prompt: prompt,
      success: true,
      provider: 'runware'
    };
  } catch (error: any) {
    console.error('[eventBackgroundGenerator] Image generation failed:', error);
    
    return {
      imageUrl: '',
      prompt: createBackgroundPrompt(detectEventType(title, description), title, description),
      success: false,
      error: error.message || "Failed to generate background image"
    };
  }
}
