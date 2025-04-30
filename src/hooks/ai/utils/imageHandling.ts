
import { runwareService } from '@/services/ai/runwareService';
import { toast } from '@/components/ui/use-toast';

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  success: boolean;
  error?: string;
  provider?: string;
}

/**
 * Handles image generation requests based on the user's prompt
 * Uses Runware API as the primary service, with no fallback
 */
export async function handleImageGeneration(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log('[imageHandling] Starting image generation with prompt:', prompt);
    
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }
    
    // Generate image using Runware service
    console.log('[imageHandling] Calling Runware API with prompt:', prompt);
    const result = await runwareService.generateImage({
      positivePrompt: prompt,
      model: "runware:100@1", // Explicitly request Runware model
      CFGScale: 12.0,
      scheduler: "FlowMatchEulerDiscreteScheduler",
      strength: 0.9
    });
    
    // Add detailed logging for debugging
    console.log('[imageHandling] Image generation successful with provider:', result.provider || 'Runware');
    console.log('[imageHandling] Image URL:', result.imageURL);
    
    if (!result.imageURL) {
      throw new Error('No image URL returned from service');
    }
    
    return {
      imageUrl: result.imageURL,
      prompt: prompt,
      success: true,
      provider: 'runware'
    };
  } catch (error: any) {
    console.error('[imageHandling] Image generation failed:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('[imageHandling] Error response:', error.response);
    }
    
    // Only show toast if it's not coming from a component that will handle the error itself
    toast({
      title: "Image Generation Failed",
      description: error.message || "Could not generate image with Runware. Please try again.",
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
