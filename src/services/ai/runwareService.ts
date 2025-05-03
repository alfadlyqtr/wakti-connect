
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  seed?: number | null;
  lora?: string[];
  width?: number;      // Add width parameter
  height?: number;     // Add height parameter
  inputImage?: string; // Optional base64 image for image-to-image transformations
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed?: number;
  NSFWContent?: boolean;
  provider?: string;
}

export class RunwareService {
  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      console.log("Requesting image generation through ai-image-generation edge function");
      console.log("Prompt being used:", params.positivePrompt);
      
      // Ensure width and height are multiples of 64 for Runware API
      const width = params.width || 1216;  // Default to 1216px (multiple of 64)
      const height = params.height || 1536; // Default to 1536px (multiple of 64)
      
      // Verify dimensions are valid for Runware (multiples of 64)
      if (width % 64 !== 0 || height % 64 !== 0) {
        console.warn(`Invalid dimensions detected. Width and height must be multiples of 64. Adjusting to nearest valid values.`);
      }
      
      // Call the consolidated ai-image-generation edge function
      const { data, error } = await supabase.functions.invoke('ai-image-generation', {
        body: { 
          prompt: params.positivePrompt, 
          imageUrl: params.inputImage,
          width: width,
          height: height,
          cfgScale: params.CFGScale,
          scheduler: params.scheduler,
          outputFormat: params.outputFormat
          // Removed promptWeighting to prevent Runware API errors
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      
      if (!data || !data.imageUrl) {
        throw new Error('No image was generated');
      }

      return {
        imageURL: data.imageUrl,
        positivePrompt: params.positivePrompt,
        seed: data.seed || 0,
        NSFWContent: data.NSFWContent || false,
        provider: data.provider || 'unknown'
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const runwareService = new RunwareService();
