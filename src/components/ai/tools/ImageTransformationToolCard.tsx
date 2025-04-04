
import React, { useState, useRef } from "react";
import { 
  ImageIcon, 
  Loader2, 
  X, 
  Upload, 
  Wand2, 
  RotateCcw, 
  Download, 
  Share2 
} from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface ImageTransformationToolCardProps {
  onImageTransformed?: (imageUrl: string, originalUrl: string, prompt: string) => void;
}

export const ImageTransformationToolCard: React.FC<ImageTransformationToolCardProps> = ({
  onImageTransformed
}) => {
  const [transformPrompt, setTransformPrompt] = useState("a Gimi-style anime illustration");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    uploadImage, 
    transformImage,
    isUploading, 
    isGenerating, 
    uploadedImageUrl,
    generatedImage,
    clearUploadedImage,
    clearGeneratedImage
  } = useAIImageGeneration();
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    try {
      // Animate progress bar while uploading
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          return prev + 5;
        });
      }, 100);

      await uploadImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload the image",
        variant: "destructive"
      });
    } finally {
      // Reset the file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleTransformClick = async () => {
    if (!uploadedImageUrl || !transformPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload an image and provide a transformation prompt",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Start progress animation
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          return prev + 1;
        });
      }, 200);
      
      const result = await transformImage(transformPrompt);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result && onImageTransformed) {
        onImageTransformed(result.imageUrl, result.originalImageUrl || "", result.prompt);
      }
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
      
    } catch (error) {
      setProgress(0);
      console.error("Error transforming image:", error);
      toast({
        title: "Transformation failed",
        description: error instanceof Error ? error.message : "Failed to transform the image",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (imageUrl: string) => {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `transformed-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Image downloaded",
      description: "Your transformed image has been downloaded",
      variant: "success"
    });
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WAKTI AI Transformed Image',
          text: 'Check out this AI-transformed image from WAKTI!',
          url: imageUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Your image has been shared",
          variant: "success"
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fall back to copy to clipboard
        copyToClipboard(imageUrl);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(imageUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard",
          variant: "success"
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy URL to clipboard",
          variant: "destructive"
        });
      },
    );
  };

  return (
    <AIToolCard
      icon={Wand2}
      title="AI Image Transformation"
      description="Transform your photos into anime/Gimi-style illustrations using AI"
      iconColor="text-purple-600"
    >
      <div className="space-y-3">
        {progress > 0 && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progress === 100 ? "Complete!" : "Processing..."}
            </p>
          </div>
        )}
        
        {!uploadedImageUrl && !generatedImage ? (
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isUploading || isGenerating}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">Upload an image</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Select a photo to transform into anime/Gimi-style art
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isGenerating}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Select Image"
                )}
              </Button>
            </div>
          </div>
        ) : uploadedImageUrl && !generatedImage ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="transform-prompt">Transformation style</Label>
              <Textarea
                id="transform-prompt"
                placeholder="Describe the style for transformation (e.g., anime, Gimi-style, cartoon)"
                value={transformPrompt}
                onChange={(e) => setTransformPrompt(e.target.value)}
                className="min-h-[80px]"
                disabled={isGenerating}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className="relative overflow-hidden border-dashed">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                  onClick={clearUploadedImage}
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="aspect-square relative">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Original image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-xs text-center bg-muted/50">
                  Original image
                </div>
              </Card>
              
              <div className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg p-2">
                <Wand2 className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Ready to transform
                </p>
                <Button 
                  onClick={handleTransformClick}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transforming...
                    </>
                  ) : "Transform Image"}
                </Button>
              </div>
            </div>
          </>
        ) : generatedImage && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card className="relative overflow-hidden border-dashed">
                <div className="aspect-square relative">
                  <img 
                    src={generatedImage.originalImageUrl || ""} 
                    alt="Original image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-xs text-center bg-muted/50">
                  Original image
                </div>
              </Card>
              
              <Card className="relative overflow-hidden border-dashed">
                <div className="aspect-square relative">
                  <img 
                    src={generatedImage.imageUrl} 
                    alt={generatedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-xs text-center bg-muted/50">
                  Transformed image
                </div>
              </Card>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleDownload(generatedImage.imageUrl)}
                className="flex-1"
                variant="default"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Button
                onClick={() => handleShare(generatedImage.imageUrl)}
                className="flex-1"
                variant="outline"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button
                onClick={() => {
                  clearGeneratedImage();
                  clearUploadedImage();
                }}
                variant="ghost"
                className="w-full mt-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try another image
              </Button>
            </div>
          </>
        )}
      </div>
    </AIToolCard>
  );
};
