
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ImageGenerationToolCardProps {
  onPromptUse?: (prompt: string) => void;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onPromptUse
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate image generation
    setTimeout(() => {
      setGeneratedImage("https://placehold.co/512x512/343541/FFFFFF/png?text=AI+Generated+Image");
      setIsGenerating(false);
      
      toast({
        title: "Image generated",
        description: "Your AI image has been created successfully.",
      });
    }, 1500);
  };
  
  const handleUsePrompt = () => {
    if (onPromptUse && prompt) {
      onPromptUse(prompt);
    }
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-wakti-blue" />
          {t("ai.tools.image.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {!generatedImage ? (
            <>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder={t("ai.tools.image.generatePrompt")}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="pr-20"
                  />
                  {prompt && onPromptUse && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 h-7 text-xs"
                      onClick={handleUsePrompt}
                    >
                      {t("ai.tools.image.usePrompt")}
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin" />
                      {t("ai.tools.image.generatingImage")}
                    </>
                  ) : (
                    t("ai.tools.image.generate")
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleReset}>
                  {t("ai.tools.voice.tryAgain")}
                </Button>
                <Button onClick={() => handleGenerate()}>
                  {t("ai.tools.image.generate")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
