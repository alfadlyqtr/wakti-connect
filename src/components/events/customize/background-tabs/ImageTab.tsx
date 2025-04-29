
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Wand2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ImageTabProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  description?: string;
}

const ImageTab: React.FC<ImageTabProps> = ({
  value,
  onChange,
  title,
  description
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const { 
    generateImage,
    isGenerating, 
    generatedImage,
    clearGeneratedImage
  } = useAIImageGeneration();
  
  // Enhanced background images with themed options (removed the 4th problematic one)
  const backgroundImages = [
    "https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1557682260-96773eb01377?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    // Birthday themed backgrounds
    "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    // Dinner/lunch themed backgrounds
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image under 2MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
        setSelectedPreset(null);
        clearGeneratedImage();
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate an AI image based on prompt
  const handleGenerateAIImage = async (e: React.MouseEvent) => {
    // Prevent event propagation to resolve click-through issues
    e.preventDefault();
    e.stopPropagation();
    
    try {
      let prompt = aiPrompt;
      
      // If no prompt is provided, generate one based on title and description
      if (!prompt && (title || description)) {
        prompt = `Beautiful event background for "${title || 'event'}"${description ? ` with theme: ${description.substring(0, 50)}` : ''}`;
        setAiPrompt(prompt);
      }
      
      if (!prompt) {
        toast({
          title: "No prompt provided",
          description: "Please enter a description for the image you want to generate",
          variant: "destructive"
        });
        return;
      }

      const result = await generateImage.mutateAsync({ prompt });
      
      if (result && result.imageUrl) {
        onChange(result.imageUrl);
        setSelectedPreset(null);
      }
    } catch (error: any) {
      toast({
        title: "Image generation failed",
        description: error.message || "Failed to generate image",
        variant: "destructive"
      });
    }
  };

  // Effect of generated image
  React.useEffect(() => {
    if (generatedImage?.imageUrl) {
      onChange(generatedImage.imageUrl);
      setSelectedPreset(null);
    }
  }, [generatedImage, onChange]);

  // This container prevents click-through for the entire component
  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        <Label className="block" onClick={(e) => e.stopPropagation()}>Upload Your Own Image</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50" onClick={(e) => e.stopPropagation()}>
          <input
            type="file"
            id="backgroundImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Label 
            htmlFor="backgroundImage" 
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Background Image (Max 2MB)</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
          <Label className="block" onClick={(e) => e.stopPropagation()}>Choose From Gallery</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>AI Generate</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 z-[9999]" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onPointerDownOutside={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div 
                className="space-y-4" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <h4 className="text-sm font-medium">Generate AI Background</h4>
                <Textarea
                  placeholder={`Describe the background you want to generate${title ? ` for "${title}"` : ''}`}
                  value={aiPrompt}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAiPrompt(e.target.value);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  rows={3}
                />
                <Button 
                  className="w-full" 
                  onClick={handleGenerateAIImage} 
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Background"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`h-24 rounded-md border cursor-pointer overflow-hidden ${
                value === image || selectedPreset === image ? 'ring-2 ring-primary' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(image);
                setSelectedPreset(image);
                clearGeneratedImage();
              }}
            >
              <img 
                src={image} 
                alt={`Background ${index + 1}`} 
                className="w-full h-full object-cover"
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          ))}
        </div>
      </div>

      {value && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          <Label className="block mb-2" onClick={(e) => e.stopPropagation()}>Background Preview</Label>
          <div className="h-40 rounded-md border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img 
              src={value} 
              alt="Background preview" 
              className="w-full h-full object-cover" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageTab;
