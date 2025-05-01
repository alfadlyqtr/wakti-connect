
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
 * Optimized for invitation card backgrounds
 */
export async function handleImageGeneration(prompt: string): Promise<GeneratedImageResult> {
  try {
    console.log('[imageHandling] Starting image generation with prompt:', prompt);
    
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }
    
    // Add parameters to ensure the generated image works well as a background
    const enhancedPrompt = `${prompt.trim()} Make it suitable for an invitation card background with space for text overlay. Use a balanced composition, soft edges, and ensure good text contrast.`;
    
    console.log('[imageHandling] Enhanced prompt:', enhancedPrompt);
    
    // Generate image using the consolidated ai-image-generation edge function
    const result = await runwareService.generateImage({
      positivePrompt: enhancedPrompt,
      // Configure for optimal background image
      CFGScale: 9, // Increased from default for better prompt adherence
      scheduler: "FlowMatchEulerDiscreteScheduler", // Best for scenic backgrounds
      outputFormat: "WEBP", // Better compression for web
      numberResults: 1,
      strength: 0.85 // Slightly higher than default
    });
    
    console.log('[imageHandling] Image generation successful');
    
    if (!result.imageURL) {
      throw new Error('No image URL returned from service');
    }
    
    return {
      imageUrl: result.imageURL,
      prompt: enhancedPrompt,
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
