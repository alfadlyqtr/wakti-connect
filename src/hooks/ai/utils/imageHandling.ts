
import { runwareService } from '@/services/ai/runwareService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  success: boolean;
  error?: string;
}

/**
 * Handles image generation requests based on the user's prompt
 * Uses Runware as primary service with OpenAI/DALL-E as fallback
 */
export async function handleImageGeneration(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log('[imageHandling] Starting image generation with prompt:', prompt);
    
    // First try with Runware service
    try {
      console.log('[imageHandling] Attempting with Runware service');
      
      const runwareResult = await runwareService.generateImage({
        positivePrompt: prompt,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 7.5
      });
      
      console.log('[imageHandling] Runware generation successful');
      
      return {
        imageUrl: runwareResult.imageURL,
        prompt: prompt,
        success: true
      };
    } catch (runwareError) {
      console.error('[imageHandling] Runware service failed:', runwareError);
      
      // Fall back to OpenAI/DALL-E through supabase edge function
      console.log('[imageHandling] Falling back to OpenAI/DALL-E');
      
      const { data, error } = await supabase.functions.invoke('ai-image-generation', {
        body: { prompt, fallbackMode: true }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.imageUrl) {
        throw new Error('No image URL returned from fallback service');
      }
      
      console.log('[imageHandling] Fallback generation successful');
      
      return {
        imageUrl: data.imageUrl,
        prompt: prompt,
        success: true
      };
    }
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
