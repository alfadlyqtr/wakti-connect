
import { runwareService } from '@/services/ai/runwareService';
import { toast } from '@/components/ui/use-toast';

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  success: boolean;
  error?: string;
}

/**
 * Handles image generation requests based on the user's prompt
 * Uses the main ai-image-generation edge function
 */
export async function handleImageGeneration(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log('[imageHandling] Starting image generation with prompt:', prompt);
    
    // Generate image using the main ai-image-generation edge function through runwareService
    const result = await runwareService.generateImage({
      positivePrompt: prompt
    });
    
    console.log('[imageHandling] Image generation successful');
    
    return {
      imageUrl: result.imageURL,
      prompt: prompt,
      success: true
    };
  } catch (error) {
    console.error('[imageHandling] Image generation failed:', error);
    
    toast({
      title: "Image Generation Failed",
      description: error.message || "Could not generate image. Please try again.",
      variant: "destructive"
    });
    
    return {
      imageUrl: '',
      prompt: prompt,
      success: false,
      error: error.message || "Image generation failed"
    };
  }
}
