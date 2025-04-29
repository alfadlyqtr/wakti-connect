
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
 * Uses the consolidated ai-image-generation edge function
 */
export async function handleImageGeneration(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log('[imageHandling] Starting image generation with prompt:', prompt);
    
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }
    
    // Generate image using the consolidated ai-image-generation edge function
    const result = await runwareService.generateImage({
      positivePrompt: prompt
    });
    
    console.log('[imageHandling] Image generation successful');
    
    if (!result.imageURL) {
      throw new Error('No image URL returned from service');
    }
    
    return {
      imageUrl: result.imageURL,
      prompt: prompt,
      success: true
    };
  } catch (error: any) {
    console.error('[imageHandling] Image generation failed:', error);
    
    // Only show toast if it's not coming from a component that will handle the error itself
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
