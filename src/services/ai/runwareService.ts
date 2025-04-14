
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const API_ENDPOINT = 'https://api.runware.ai/v1';

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
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  private apiKey: string | null = null;

  constructor() {
    // We'll get the API key when needed
  }
  
  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    try {
      // Get the API key from the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-runware-api-key');
      
      if (error) throw error;
      
      if (!data?.apiKey) {
        throw new Error('Failed to retrieve Runware API key');
      }
      
      this.apiKey = data.apiKey;
      return this.apiKey;
    } catch (error) {
      console.error('Error retrieving Runware API key:', error);
      throw error;
    }
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      const taskUUID = crypto.randomUUID();
      
      // Get the API key before making the request
      const apiKey = await this.getApiKey();
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey
          },
          {
            taskType: "imageInference",
            taskUUID,
            positivePrompt: params.positivePrompt,
            model: params.model || "runware:100@1",
            width: 1024,
            height: 1024,
            numberResults: params.numberResults || 1,
            outputFormat: params.outputFormat || "WEBP",
            CFGScale: params.CFGScale || 1,
            scheduler: params.scheduler || "FlowMatchEulerDiscreteScheduler",
            strength: params.strength || 0.8,
            lora: params.lora || [],
          }
        ])
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (data.error || data.errors) {
        throw new Error(data.error || data.errors[0]?.message || 'An error occurred');
      }

      const generatedImage = data.data.find((item: any) => item.taskType === 'imageInference');
      
      if (!generatedImage) {
        throw new Error('No image was generated');
      }

      return {
        imageURL: generatedImage.imageURL,
        positivePrompt: generatedImage.positivePrompt,
        seed: generatedImage.seed,
        NSFWContent: generatedImage.NSFWContent || false
      };
    } catch (error) {
      console.error('Error generating image with Runware:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const runwareService = new RunwareService();
