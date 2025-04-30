
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundType } from "@/types/invitation.types";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Button } from "@/components/ui/button";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Loader2, Upload } from "lucide-react";

interface BackgroundSelectorProps {
  backgroundType: BackgroundType;
  backgroundValue: string;
  onBackgroundChange: (type: BackgroundType, value: string) => void;
}

const GRADIENTS = [
  { name: "Blue to Purple", value: "linear-gradient(135deg, #6366F1, #8B5CF6)" },
  { name: "Green to Blue", value: "linear-gradient(135deg, #10B981, #3B82F6)" },
  { name: "Orange to Pink", value: "linear-gradient(135deg, #F59E0B, #EC4899)" },
  { name: "Red to Orange", value: "linear-gradient(135deg, #EF4444, #F59E0B)" },
  { name: "Purple to Pink", value: "linear-gradient(135deg, #8B5CF6, #EC4899)" },
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
}) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const { generateImage, isGenerating, generatedImage } = useAIImageGeneration();

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    const result = await generateImage.mutateAsync({ prompt: aiPrompt });
    if (result?.imageUrl) {
      onBackgroundChange("image", result.imageUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onBackgroundChange("image", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="font-medium">Background</Label>
      
      <Tabs value={backgroundType} onValueChange={(value) => onBackgroundChange(value as BackgroundType, backgroundValue)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="solid">Solid Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="solid" className="space-y-4">
          <div>
            <Label>Color</Label>
            <ColorInput 
              value={backgroundType === "solid" ? backgroundValue : "#ffffff"} 
              onChange={(value) => onBackgroundChange("solid", value)} 
              className="w-full"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="gradient" className="space-y-4">
          <Label>Choose a gradient</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GRADIENTS.map((gradient, index) => (
              <div
                key={index}
                className={`h-20 rounded-md cursor-pointer border-2 ${
                  backgroundValue === gradient.value ? "border-primary" : "border-transparent"
                }`}
                style={{ background: gradient.value }}
                onClick={() => onBackgroundChange("gradient", gradient.value)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div>
            <Label>Upload Image</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="mt-1"
            />
          </div>
          
          <div className="border-t pt-4">
            <Label>Or generate with AI</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={aiPrompt} 
                onChange={(e) => setAiPrompt(e.target.value)} 
                placeholder="Describe the background you want..." 
              />
              <Button 
                onClick={handleAIGenerate} 
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Example: "A beautiful sunset over mountains"
            </p>
          </div>
          
          {backgroundType === "image" && backgroundValue && (
            <div className="mt-2">
              <Label>Preview</Label>
              <div className="w-full h-24 mt-1 rounded-md overflow-hidden">
                <img 
                  src={backgroundValue} 
                  alt="Background preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
