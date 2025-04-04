
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  originalImageUrl?: string | null;
  prompt: string;
  isTransformation?: boolean;
}

export const useAIImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const generateImage = useMutation({
    mutationFn: async ({ prompt, imageUrl }: { prompt: string; imageUrl?: string }) => {
      setIsGenerating(true);
      try {
        console.log("Starting image generation with prompt:", prompt);
        console.log("Image URL for transformation:", imageUrl || "None");

        const { data, error } = await supabase.functions.invoke('ai-image-generation', {
          body: { prompt, imageUrl }
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
          originalImageUrl: data.originalImageUrl,
          prompt,
          isTransformation: data.isTransformation
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
        title: data.isTransformation ? "Image transformed" : "Image generated",
        description: data.isTransformation 
          ? "Your image has been transformed into anime/Gimi-style" 
          : "Your image has been created successfully",
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

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Convert the file to a data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            const dataUrl = event.target.result;
            setUploadedImageUrl(dataUrl);
            setIsUploading(false);
            resolve(dataUrl);
          } else {
            setIsUploading(false);
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => {
          setIsUploading(false);
          reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
      throw error;
    }
  };

  const transformImage = async (prompt: string) => {
    if (!uploadedImageUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    return await generateImage.mutateAsync({ prompt, imageUrl: uploadedImageUrl });
  };

  const clearUploadedImage = () => {
    setUploadedImageUrl(null);
  };

  const clearGeneratedImage = () => {
    setGeneratedImage(null);
  };

  return {
    generateImage,
    transformImage,
    uploadImage,
    isGenerating,
    isUploading,
    generatedImage,
    uploadedImageUrl,
    clearGeneratedImage,
    clearUploadedImage
  };
};
