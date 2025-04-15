
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds";
  seed?: number | null;
  lora?: string[];
  inputImage?: string; // Optional base64 image for image-to-image transformations
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  constructor() {
    // No need to store API key anymore as it's handled securely by the edge function
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      console.log("Requesting image generation through secure edge function");
      
      // Call the secure edge function instead of directly accessing the Runware API
      const { data, error } = await supabase.functions.invoke('get-runware-api-key', {
        body: params
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      
      if (!data || !data.imageURL) {
        throw new Error('No image was generated');
      }

      return {
        imageURL: data.imageURL,
        positivePrompt: data.positivePrompt,
        seed: data.seed,
        NSFWContent: data.NSFWContent || false
      };
    } catch (error) {
      console.error('Error generating image with Runware:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const runwareService = new RunwareService();
