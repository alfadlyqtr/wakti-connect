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
    // Keep the user's original prompt intact without adding too many modifiers
    const enhancedPrompt = prompt.trim();
    
    console.log('[imageHandling] Using prompt:', enhancedPrompt);
    
    // Generate image using the edge function
    const result = await runwareService.generateImage({
      positivePrompt: enhancedPrompt,
      // Configure for optimal background image with correct dimensions for invitation cards
      // Ensure width is a multiple of 64 as required by Runware API
      width: 1216,         // Exact multiple of 64
      height: 1536,        // Exact multiple of 64, maintains ~3:4 ratio
      CFGScale: 9,         // Increased from default for better prompt adherence
      scheduler: "FlowMatchEulerDiscreteScheduler", // Best for scenic backgrounds
      outputFormat: "WEBP", // Better compression for web
      numberResults: 1,
      strength: 0.85      // Slightly higher than default
      // Removed promptWeighting to prevent errors with Runware API
    });
    
    console.log('[imageHandling] Image generation successful, provider:', result.provider);
    console.log('[imageHandling] Image URL:', result.imageURL);
    
    if (!result.imageURL) {
      throw new Error('No image URL returned from service');
    }
    
    return {
      imageUrl: result.imageURL,
      prompt: enhancedPrompt,
      provider: result.provider,
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
