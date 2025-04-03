
import React, { useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";

interface ImageGenerationToolCardProps {
  onPromptUse?: (prompt: string) => void;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onPromptUse
}) => {
  const [prompt, setPrompt] = useState("");
  const { 
    generateImage, 
    isGenerating, 
    generatedImage,
    clearGeneratedImage
  } = useAIImageGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await generateImage.mutateAsync(prompt);
  };

  const handleUsePrompt = () => {
    if (onPromptUse && prompt) {
      onPromptUse(prompt);
    }
  };

  return (
    <AIToolCard
      icon={ImageIcon}
      title="Image Generation"
      description="Generate images using AI based on your descriptions"
      iconColor="text-purple-500"
    >
      <div className="space-y-3">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
          disabled={isGenerating}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate Image"}
          </Button>
          
          {onPromptUse && (
            <Button 
              variant="secondary"
              onClick={handleUsePrompt}
              disabled={!prompt.trim() || isGenerating}
            >
              Use Prompt
            </Button>
          )}
        </div>

        {generatedImage && (
          <Card className="relative overflow-hidden mt-3 border-dashed">
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
                alt={generatedImage.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-xs text-muted-foreground bg-muted/50">
              {generatedImage.prompt}
            </div>
          </Card>
        )}
      </div>
    </AIToolCard>
  );
};
