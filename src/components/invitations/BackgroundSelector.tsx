
import React, { useState, useEffect } from "react";
import { BackgroundType } from "@/types/invitation.types";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Sparkles, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BackgroundSelectorProps {
  backgroundType: string;
  backgroundValue: string;
  onBackgroundChange: (type: BackgroundType, value: string) => void;
  onGenerateAIBackground?: () => void;
  title?: string;
  description?: string;
  isGeneratingImage?: boolean;
}

export default function BackgroundSelector({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
  onGenerateAIBackground,
  title,
  description,
  isGeneratingImage = false
}: BackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>(backgroundType);
  const [gradientPresets, setGradientPresets] = useState<string[]>([
    "linear-gradient(to right, #ee9ca7, #ffdde1)",
    "linear-gradient(to right, #2193b0, #6dd5ed)",
    "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
    "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)"
  ]);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  
  // Generate default AI prompt based on title and description
  const getDefaultPrompt = () => {
    let defaultPrompt = "Generate a beautiful background";
    
    if (title) {
      defaultPrompt += ` for "${title}"`;
    }
    
    if (description) {
      defaultPrompt += ` with theme: ${description.substring(0, 50)}`;
    }
    
    defaultPrompt += " that works well as an invitation card background with space for text";
    return defaultPrompt;
  };

  // Update active tab when backgroundType changes from parent
  useEffect(() => {
    if (backgroundType) {
      setActiveTab(backgroundType);
    }
  }, [backgroundType]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Set default values when changing tabs
    if (value === "solid") {
      onBackgroundChange("solid" as BackgroundType, "#ffffff");
    } else if (value === "gradient") {
      onBackgroundChange("gradient" as BackgroundType, gradientPresets[0]);
    } else if (value === "image" && backgroundType !== "image") {
      onBackgroundChange("image" as BackgroundType, "");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onBackgroundChange("image" as BackgroundType, result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCustomAIGeneration = () => {
    if (!onGenerateAIBackground) return;
    if (!customPrompt.trim()) {
      setCustomPrompt(getDefaultPrompt());
      toast({
        title: "Using default prompt",
        description: "Custom prompt is empty, using generated prompt based on invitation details",
      });
    }
    onGenerateAIBackground();
  };

  return (
    <div className="space-y-4">
      <Label>Background</Label>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="solid">Solid Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="solid" className="pt-4">
          <div className="space-y-3">
            <Label htmlFor="background-color">Select Color</Label>
            <ColorInput
              id="background-color"
              value={backgroundType === "solid" ? backgroundValue : "#ffffff"}
              onChange={(color) => onBackgroundChange("solid" as BackgroundType, color)}
              className="w-full"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="gradient" className="pt-4">
          <div className="space-y-4">
            <Label>Select Gradient</Label>
            <div className="grid grid-cols-2 gap-2">
              {gradientPresets.map((gradient, index) => (
                <div
                  key={index}
                  className={`h-16 rounded-md cursor-pointer border-2 ${
                    backgroundValue === gradient ? "border-primary" : "border-transparent"
                  }`}
                  style={{ background: gradient }}
                  onClick={() => onBackgroundChange("gradient" as BackgroundType, gradient)}
                />
              ))}
            </div>
            
            <div className="pt-2">
              <Label htmlFor="custom-gradient">Custom Gradient (CSS)</Label>
              <Input
                id="custom-gradient"
                value={backgroundType === "gradient" ? backgroundValue : ""}
                onChange={(e) => onBackgroundChange("gradient" as BackgroundType, e.target.value)}
                placeholder="linear-gradient(direction, color1, color2)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example: linear-gradient(to right, #ec008c, #fc6767)
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="pt-4">
          <div className="space-y-4">
            {backgroundType === "image" && backgroundValue ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <img 
                    src={backgroundValue} 
                    alt="Background Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onBackgroundChange("image" as BackgroundType, "")}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  Upload an image for your invitation background
                </p>
                <input
                  type="file"
                  id="background-image-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="background-image-upload">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <div>
                      <Upload className="h-4 w-4" />
                      Browse...
                    </div>
                  </Button>
                </label>
              </div>
            )}
            
            <div className="mt-4 border-t pt-4 space-y-3">
              <Label htmlFor="ai-prompt">AI Background Prompt</Label>
              <Textarea
                id="ai-prompt"
                placeholder={getDefaultPrompt()}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-20 text-sm resize-none"
                disabled={isGeneratingImage}
              />
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleCustomAIGeneration}
                disabled={isGeneratingImage}
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingImage ? "Generating..." : "Generate AI Background"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Creates a custom background based on your prompt or invitation details
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
