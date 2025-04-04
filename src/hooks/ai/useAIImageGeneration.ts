
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
}

export const useAIImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const { toast } = useToast();

  const generateImage = useMutation({
    mutationFn: async (prompt: string) => {
      setIsGenerating(true);
      try {
        console.log("Starting image generation with prompt:", prompt);

        const { data, error } = await supabase.functions.invoke('ai-image-generation', {
          body: { prompt }
        });

        if (error) {
          console.error("Edge function error:", error);
          throw new Error(error.message || 'Failed to generate image');
        }

        if (data.error) {
          console.error("API response error:", data.error);
          throw new Error(data.error);
        }

        console.log("Image generation successful:", data);
        return {
          id: data.id,
          imageUrl: data.imageUrl,
          prompt
        };
      } catch (error) {
        console.error("Image generation error:", error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: (data) => {
      setGeneratedImage(data);
      toast({
        title: "Image generated",
        description: "Your image has been created successfully",
        variant: "success"
      });
    },
    onError: (error) => {
      console.error("Image generation error (from onError):", error);
      toast({
        title: "Image generation failed",
        description: error.message || "An error occurred while generating the image",
        variant: "destructive"
      });
    }
  });

  const clearGeneratedImage = () => {
    setGeneratedImage(null);
  };

  return {
    generateImage,
    isGenerating,
    generatedImage,
    clearGeneratedImage
  };
};
