
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
}

export interface UploadedReferenceImage {
  dataUrl: string;
  fileName?: string;
  type: 'upload' | 'camera';
}

export const useAIImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<UploadedReferenceImage | null>(null);
  const { toast } = useToast();

  const generateImage = useMutation({
    mutationFn: async (prompt: string) => {
      setIsGenerating(true);
      try {
        // Include reference image if available
        const payload: { prompt: string; referenceImage?: string } = { 
          prompt
        };
        
        if (referenceImage) {
          payload.referenceImage = referenceImage.dataUrl;
        }

        const { data, error } = await supabase.functions.invoke('ai-image-generation', {
          body: payload
        });

        if (error) {
          throw new Error(error.message || 'Failed to generate image');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        return {
          id: data.id,
          imageUrl: data.imageUrl,
          prompt
        };
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

  const clearReferenceImage = () => {
    setReferenceImage(null);
  };

  const setUploadedReferenceImage = (dataUrl: string, fileName?: string) => {
    setReferenceImage({
      dataUrl,
      fileName,
      type: 'upload'
    });
  };

  const setCapturedReferenceImage = (dataUrl: string) => {
    setReferenceImage({
      dataUrl,
      type: 'camera'
    });
  };

  return {
    generateImage,
    isGenerating,
    generatedImage,
    clearGeneratedImage,
    referenceImage,
    setUploadedReferenceImage,
    setCapturedReferenceImage,
    clearReferenceImage
  };
};
