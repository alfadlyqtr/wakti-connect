
import { toast } from '@/components/ui/use-toast';

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
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      const taskUUID = crypto.randomUUID();
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: this.apiKey
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

// Singleton instance with the API key
export const runwareService = new RunwareService('yzJMWPrRdkJcge2q0yjSOwTGvlhMeOy1');
