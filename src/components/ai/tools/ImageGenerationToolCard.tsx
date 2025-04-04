
import React, { useState, useRef } from "react";
import { ImageIcon, Loader2, X, Mic, MicOff } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";

interface ImageGenerationToolCardProps {
  onPromptUse?: (prompt: string) => void;
  onImageGenerate?: (imageUrl: string, prompt: string) => void;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onPromptUse,
  onImageGenerate
}) => {
  const [prompt, setPrompt] = useState("");
  const { 
    generateImage, 
    isGenerating, 
    generatedImage,
    clearGeneratedImage
  } = useAIImageGeneration();
  const { toast } = useToast();

  // Speech recognition for voice input
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    supported: speechSupported
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true
  });

  // Update prompt when transcript changes
  React.useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for the image you want to generate",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Generating image with prompt:", prompt);
      const result = await generateImage.mutateAsync(prompt);
      
      // If the parent component needs to know about the generated image
      if (onImageGenerate && result) {
        onImageGenerate(result.imageUrl, result.prompt);
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleUsePrompt = () => {
    if (onPromptUse && prompt) {
      onPromptUse(prompt);
    }
  };

  const handleToggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      setPrompt("");
      startListening();
    }
  };

  // Generate placeholder text based on state
  const getPlaceholderText = () => {
    if (isListening) return "Listening...";
    return "Describe the image you want to generate...";
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
          placeholder={getPlaceholderText()}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
          disabled={isGenerating || isListening}
        />
        
        <div className="flex gap-2 flex-wrap">
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
              className="flex-shrink-0"
            >
              Use Prompt
            </Button>
          )}
        </div>

        {/* Voice input */}
        {speechSupported && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleMicrophone}
              className={isListening ? "bg-red-100 border-red-300" : ""}
              title={isListening ? "Stop listening" : "Speak your prompt"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Generated Image Display */}
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
