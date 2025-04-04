
import React, { useState, useRef } from "react";
import { Image, Loader2, Upload, RefreshCw, X } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const ImageTransformationToolCard: React.FC = () => {
  const [prompt, setPrompt] = useState("Transform into anime/Gimi-style");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    transformImage, 
    uploadImage, 
    isUploading,
    isGenerating, 
    generatedImage,
    uploadedImageUrl,
    clearUploadedImage,
    clearGeneratedImage
  } = useAIImageGeneration();
  const { toast } = useToast();

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await uploadImage(file);
      toast({
        title: "Image uploaded",
        description: "Your image is ready to be transformed",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const handleTransform = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    try {
      await transformImage(prompt);
    } catch (error) {
      toast({
        title: "Transformation failed",
        description: error instanceof Error ? error.message : "Failed to transform image",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!generatedImage?.imageUrl) return;
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `transformed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AIToolCard
      icon={RefreshCw}
      title="Image Transformation"
      description="Transform your uploaded images into anime/Gimi-style illustrations"
      iconColor="text-emerald-500"
    >
      <div className="space-y-3">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!uploadedImageUrl && !generatedImage ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={handleFileSelect}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <div className="text-sm text-center text-gray-500">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        ) : (
          <>
            {uploadedImageUrl && !generatedImage && (
              <Card className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                  onClick={clearUploadedImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="aspect-square relative">
                  <img 
                    src={uploadedImageUrl}
                    alt="Uploaded image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}
            
            {generatedImage && (
              <Card className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                  onClick={clearGeneratedImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="aspect-square relative">
                  <img 
                    src={generatedImage.imageUrl} 
                    alt="Transformed image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-muted/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Image className="h-4 w-4 mr-2" /> Download Image
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
        
        {uploadedImageUrl && !generatedImage && (
          <>
            <Textarea
              placeholder="Describe how you want to transform the image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[60px]"
              disabled={isGenerating}
            />
            
            <Button 
              onClick={handleTransform}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transforming...
                </>
              ) : "Transform Image"}
            </Button>
          </>
        )}
        
        {(generatedImage || (!uploadedImageUrl && !generatedImage)) && (
          <Button 
            variant="outline"
            onClick={() => {
              clearGeneratedImage();
              clearUploadedImage();
              handleFileSelect();
            }}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" /> 
            Upload New Image
          </Button>
        )}
      </div>
    </AIToolCard>
  );
};
