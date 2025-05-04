
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
      const width = params.width ? Math.floor(params.width / 64) * 64 : 1216;  // Default to 1216px
      const height = params.height ? Math.floor(params.height / 64) * 64 : 1536; // Default to 1536px
      
      // Verify dimensions are valid for Runware (multiples of 64)
      if (width % 64 !== 0 || height % 64 !== 0) {
        console.warn(`Invalid dimensions detected. Adjusting to nearest multiples of 64: ${width}x${height}`);
      }
      
      console.log(`Using dimensions: ${width}x${height}`);
      
      // Call the consolidated ai-image-generation edge function
      const { data, error } = await supabase.functions.invoke('ai-image-generation', {
        body: { 
          prompt: params.positivePrompt, 
          imageUrl: params.inputImage,
          width: width,
          height: height,
          cfgScale: params.CFGScale,
          scheduler: params.scheduler,
          outputFormat: params.outputFormat,
          // Don't pass promptWeighting at all to avoid Runware API errors
          preferProvider: 'runware' // Try to use Runware first
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Image Generation Failed",
          description: "Error from image generation service. Trying backup method...",
          variant: "warning"
        });
        throw error;
      }
      
      if (!data || !data.imageUrl) {
        console.error('No image was generated');
        toast({
          title: "Image Generation Issue",
          description: "No image was returned. Trying backup method...",
          variant: "warning"
        });
        throw new Error('No image was generated');
      }

      console.log('Image generated successfully by provider:', data.provider);
      console.log('Image URL:', data.imageUrl);

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
