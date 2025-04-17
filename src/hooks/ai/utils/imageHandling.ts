
import { runwareService } from '@/services/ai/runwareService';
import { toast } from '@/components/ui/use-toast';

export interface GeneratedImageResult {
  imageUrl: string;
  prompt: string;
  success: boolean;
  error?: string;
}

export interface ProcessedImageResult {
  imageUrl: string;
  success: boolean;
  error?: string;
  processing?: {
    removedBackground?: boolean;
    enhanced?: boolean;
  };
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

/**
 * Process existing image by enhancing it or removing background
 * @param imageFile The image file to process
 * @param options Processing options
 */
export async function processImage(
  imageFile: File, 
  options: { removeBackground?: boolean; enhance?: boolean }
): Promise<ProcessedImageResult> {
  try {
    console.log('[imageHandling] Processing image:', imageFile.name);
    
    // Convert image to base64 for processing
    const base64Image = await fileToBase64(imageFile);
    
    if (options.removeBackground) {
      // This would call a background removal service
      // For now, we'll just return a mock result
      console.log('[imageHandling] Background removal requested but not implemented yet');
    }
    
    if (options.enhance) {
      // This would call an image enhancement service
      // For now, we'll just return a mock result
      console.log('[imageHandling] Image enhancement requested but not implemented yet');
    }
    
    // In a real implementation, you would call appropriate services
    // For now, we'll just return the original image
    
    return {
      imageUrl: base64Image,
      success: true,
      processing: {
        removedBackground: options.removeBackground,
        enhanced: options.enhance
      }
    };
  } catch (error) {
    console.error('[imageHandling] Image processing failed:', error);
    
    toast({
      title: "Image Processing Failed",
      description: error.message || "Could not process image. Please try again.",
      variant: "destructive"
    });
    
    return {
      imageUrl: '',
      success: false,
      error: error.message || "Image processing failed"
    };
  }
}

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
