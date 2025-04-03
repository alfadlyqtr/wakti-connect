
import React, { useState } from "react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageIcon, Loader2 } from "lucide-react";
import { useImageGeneration, ImageSize, ImageStyle } from "@/hooks/ai/useImageGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageGenerationToolCardProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void;
  compact?: boolean;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onImageGenerated,
  compact = false
}) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("natural");
  const [size, setSize] = useState<ImageSize>("1024x1024");
  const [activeTab, setActiveTab] = useState("prompt");
  
  const {
    generateImage,
    isGenerating,
    imageUrl,
    revisedPrompt,
    error
  } = useImageGeneration({
    style,
    size,
    onComplete: (url, prompt) => {
      onImageGenerated(url, prompt);
      setActiveTab("preview");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateImage(prompt);
    }
  };
  
  const handleUseImage = () => {
    if (imageUrl && revisedPrompt) {
      onImageGenerated(imageUrl, revisedPrompt);
    }
  };
  
  if (compact) {
    return (
      <div className="space-y-3 p-3 border rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-sm font-medium">Image Generation</h3>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-xs"
          />
          
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <div className="flex items-center gap-1">
              <Label htmlFor="style-natural-compact" className="text-xs cursor-pointer">Natural</Label>
              <RadioGroupItem
                value="natural"
                id="style-natural-compact"
                checked={style === "natural"}
                onClick={() => setStyle("natural")}
                className="h-3 w-3"
              />
            </div>
            <div className="flex items-center gap-1">
              <Label htmlFor="style-vivid-compact" className="text-xs cursor-pointer">Vivid</Label>
              <RadioGroupItem
                value="vivid"
                id="style-vivid-compact"
                checked={style === "vivid"}
                onClick={() => setStyle("vivid")}
                className="h-3 w-3"
              />
            </div>
            <span className="text-muted-foreground mx-1">|</span>
            <div className="flex items-center gap-1">
              <Label htmlFor="size-square-compact" className="text-xs cursor-pointer">Square</Label>
              <RadioGroupItem
                value="1024x1024"
                id="size-square-compact"
                checked={size === "1024x1024"}
                onClick={() => setSize("1024x1024")}
                className="h-3 w-3"
              />
            </div>
            <div className="flex items-center gap-1">
              <Label htmlFor="size-portrait-compact" className="text-xs cursor-pointer">Portrait</Label>
              <RadioGroupItem
                value="1024x1792"
                id="size-portrait-compact"
                checked={size === "1024x1792"}
                onClick={() => setSize("1024x1792")}
                className="h-3 w-3"
              />
            </div>
            <div className="flex items-center gap-1">
              <Label htmlFor="size-landscape-compact" className="text-xs cursor-pointer">Landscape</Label>
              <RadioGroupItem
                value="1792x1024"
                id="size-landscape-compact"
                checked={size === "1792x1024"}
                onClick={() => setSize("1792x1024")}
                className="h-3 w-3"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isGenerating || !prompt.trim()} 
            className="w-full h-8 text-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>
        
        {imageUrl && (
          <div className="mt-2">
            <img 
              src={imageUrl} 
              alt={revisedPrompt || prompt}
              className="rounded-md w-full h-auto object-cover cursor-pointer"
              onClick={handleUseImage}
            />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              Click image to use in conversation
            </p>
          </div>
        )}
        
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <AIToolCard
      icon={ImageIcon}
      title="Image Generation"
      description="Create AI-generated images based on your descriptions"
      iconColor="text-purple-500"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt">Create Image</TabsTrigger>
          <TabsTrigger value="preview" disabled={!imageUrl}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="space-y-4 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Image Description</Label>
              <Input
                id="prompt"
                placeholder="A serene landscape with mountains and a lake at sunset"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Style</Label>
              <RadioGroup 
                value={style} 
                onValueChange={(value) => setStyle(value as ImageStyle)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="natural" id="natural" />
                  <Label htmlFor="natural">Natural</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vivid" id="vivid" />
                  <Label htmlFor="vivid">Vivid</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Size</Label>
              <RadioGroup 
                value={size} 
                onValueChange={(value) => setSize(value as ImageSize)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1024x1024" id="square" />
                  <Label htmlFor="square">Square</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1024x1792" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1792x1024" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()} 
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>
          </form>
          
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 pt-4">
          {imageUrl && (
            <div className="space-y-4">
              <div className="relative aspect-square max-w-md mx-auto rounded-md overflow-hidden border">
                <img 
                  src={imageUrl} 
                  alt={revisedPrompt || prompt}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Generated from prompt:</Label>
                <p className="text-sm p-2 bg-muted rounded-md">{revisedPrompt || prompt}</p>
              </div>
              
              <Button 
                onClick={handleUseImage} 
                className="w-full"
              >
                Use in Conversation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AIToolCard>
  );
};
