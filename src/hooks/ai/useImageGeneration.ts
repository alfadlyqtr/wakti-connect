
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type ImageStyle = 'vivid' | 'natural';
export type ImageSize = '1024x1024' | '1024x1792' | '1792x1024';

interface ImageGenerationOptions {
  size?: ImageSize;
  style?: ImageStyle;
  onStart?: () => void;
  onComplete?: (imageUrl: string, prompt: string) => void;
  onError?: (error: any) => void;
}

export const useImageGeneration = (options?: ImageGenerationOptions) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please provide a description to generate an image.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      options?.onStart?.();
      
      toast({
        title: "Generating Image",
        description: "This may take up to 30 seconds...",
      });
      
      // Prepare parameters for image generation
      const params = {
        prompt,
        size: options?.size || '1024x1024',
        style: options?.style || 'natural'
      };
      
      console.log("Generating image with params:", params);
      
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('ai-image-generation', {
        body: params
      });
      
      if (functionError) {
        console.error('Image generation error:', functionError);
        setError(functionError.message || 'Failed to generate image');
        options?.onError?.(functionError);
        toast({
          title: "Image Generation Failed",
          description: functionError.message || "Could not generate image. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (data?.error) {
        console.error('Image generation API error:', data.error);
        setError(data.error);
        options?.onError?.(data.error);
        toast({
          title: "Image Generation Failed",
          description: data.errorDetails || "Could not generate image. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (!data?.imageUrl) {
        throw new Error('No image URL received');
      }
      
      console.log("Image generated successfully:", data.imageUrl);
      
      // Set the image URL and revised prompt
      setImageUrl(data.imageUrl);
      setRevisedPrompt(data.revisedPrompt || prompt);
      
      // Notify completion
      options?.onComplete?.(data.imageUrl, data.revisedPrompt || prompt);
      
      toast({
        title: "Image Generated Successfully",
        description: "Your image has been created and added to the conversation.",
        variant: "success",
      });
      
    } catch (err) {
      console.error('Unexpected error in image generation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      options?.onError?.(err);
      toast({
        title: "Image Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [options, toast]);

  return {
    generateImage,
    imageUrl,
    revisedPrompt,
    isGenerating,
    error
  };
};
