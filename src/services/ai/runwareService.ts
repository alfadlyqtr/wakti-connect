
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
  promptWeighting?: "compel" | "sdEmbeds";
  seed?: number | null;
  lora?: string[];
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
      
      // Call the consolidated ai-image-generation edge function
      const { data, error } = await supabase.functions.invoke('ai-image-generation', {
        body: { 
          prompt: params.positivePrompt, 
          imageUrl: params.inputImage 
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
