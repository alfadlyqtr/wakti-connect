
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { AnimationType, BackgroundType, GradientDirection } from "@/types/event.types";
import { GradientGenerator } from "@/components/ui/gradient-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface BackgroundTabProps {
  backgroundType: BackgroundType;
  backgroundValue: string;
  backgroundAngle?: number;
  backgroundDirection?: GradientDirection;
  headerImage?: string;
  animation?: AnimationType;
  onBackgroundChange: (type: BackgroundType, value: string) => void;
  onBackgroundAngleChange: (angle: number) => void;
  onBackgroundDirectionChange: (direction: GradientDirection) => void;
  onHeaderImageChange: (imageUrl: string) => void;
  onAnimationChange: (value: AnimationType) => void;
  onGradientChange?: (gradient: string) => void;
}

const backgroundOptions = [
  { id: "solid", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "image", label: "Image" },
];

const animationOptions = [
  { id: "none", label: "None" },
  { id: "fade", label: "Fade" },
  { id: "slide", label: "Slide" },
  { id: "pop", label: "Pop" },
];

const gradientDirections: { id: GradientDirection; label: string }[] = [
  { id: "to-r", label: "→ Right" },
  { id: "to-l", label: "← Left" },
  { id: "to-b", label: "↓ Bottom" },
  { id: "to-t", label: "↑ Top" },
  { id: "to-br", label: "↘ Bottom Right" },
  { id: "to-bl", label: "↙ Bottom Left" },
  { id: "to-tr", label: "↗ Top Right" },
  { id: "to-tl", label: "↖ Top Left" },
];

const BackgroundTab: React.FC<BackgroundTabProps> = ({
  backgroundType,
  backgroundValue,
  backgroundAngle = 135,
  backgroundDirection = "to-r",
  headerImage,
  animation,
  onBackgroundChange,
  onBackgroundAngleChange,
  onBackgroundDirectionChange,
  onHeaderImageChange,
  onAnimationChange,
  onGradientChange
}) => {
  const [gradientTab, setGradientTab] = useState<'simple' | 'advanced'>('simple');
  
  // Function to handle gradient CSS from the generator
  const handleGradientCss = (css: string) => {
    // Extract the gradient portion from the CSS string
    const match = css.match(/background: (.*);/);
    if (match && match[1]) {
      const gradientValue = match[1];
      onBackgroundChange("gradient", gradientValue);
      if (onGradientChange) onGradientChange(gradientValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Background</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose the background style for your event card
        </p>
        
        <RadioGroup
          value={backgroundType}
          onValueChange={(value) => {
            onBackgroundChange(value as BackgroundType, 
              value === "solid" ? "#ffffff" : 
              value === "gradient" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : 
              "https://example.com/placeholder.jpg"
            );
          }}
          className="grid grid-cols-3 gap-4"
        >
          {backgroundOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`background-${option.id}`} />
              <Label htmlFor={`background-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Conditional fields based on selected background type */}
      {backgroundType === "solid" && (
        <div className="space-y-4">
          <Label>Background Color</Label>
          <ColorPickerInput
            value={backgroundValue}
            onChange={(value) => onBackgroundChange("solid", value)}
          />
        </div>
      )}

      {backgroundType === "gradient" && (
        <div className="space-y-4">
          <Tabs value={gradientTab} onValueChange={(v) => setGradientTab(v as 'simple' | 'advanced')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="space-y-4">
              <div>
                <Label>Gradient Angle</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Slider
                    value={[backgroundAngle]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value) => onBackgroundAngleChange(value[0])}
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {backgroundAngle}°
                  </span>
                </div>
              </div>

              <div>
                <Label>Gradient Direction</Label>
                <RadioGroup
                  value={backgroundDirection}
                  onValueChange={(v) => onBackgroundDirectionChange(v as GradientDirection)}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
                  {gradientDirections.map((direction) => (
                    <div key={direction.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={direction.id} id={`direction-${direction.id}`} />
                      <Label htmlFor={`direction-${direction.id}`}>{direction.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Color</Label>
                  <ColorPickerInput
                    value="#6366f1"
                    onChange={(value) => {
                      const endColor = backgroundValue.includes('gradient') ? 
                        backgroundValue.split(',').pop()?.trim().replace(')', '') : 
                        "#8b5cf6";
                      onBackgroundChange("gradient", `linear-gradient(${backgroundAngle}deg, ${value}, ${endColor})`);
                    }}
                  />
                </div>
                
                <div>
                  <Label>End Color</Label>
                  <ColorPickerInput
                    value="#8b5cf6"
                    onChange={(value) => {
                      const startColor = backgroundValue.includes('gradient') ? 
                        backgroundValue.split(',')[1]?.trim() : 
                        "#6366f1";
                      onBackgroundChange("gradient", `linear-gradient(${backgroundAngle}deg, ${startColor}, ${value})`);
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <div className="space-y-2">
                <Label>Advanced Gradient Generator</Label>
                <p className="text-sm text-muted-foreground">Create complex gradients with multiple color stops</p>
                <GradientGenerator />
                <Button 
                  onClick={() => {
                    const gradientCSS = document.getElementById('css') as HTMLInputElement;
                    if (gradientCSS && gradientCSS.value) {
                      handleGradientCss(gradientCSS.value);
                    }
                  }}
                  className="w-full mt-2"
                >
                  Apply Gradient
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {backgroundType === "image" && (
        <div className="space-y-4">
          <Label>Image URL</Label>
          <Input
            value={backgroundValue}
            onChange={(e) => onBackgroundChange("image", e.target.value)}
            placeholder="Enter image URL"
          />
          
          <Label>Header Image (Optional)</Label>
          <Input
            value={headerImage || ""}
            onChange={(e) => onHeaderImageChange(e.target.value)}
            placeholder="Enter header image URL"
          />
          
          <div className="space-y-2">
            <Label>Upload Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
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
              }}
            />
            <p className="text-xs text-muted-foreground">Max size: 2MB</p>
          </div>
        </div>
      )}

      {/* Animation settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Animation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose animation style for the event card
        </p>

        <RadioGroup
          value={animation || "none"}
          onValueChange={(value) => {
            if (value !== "none") {
              onAnimationChange(value as AnimationType);
            } else {
              onAnimationChange("none");
            }
          }}
          className="grid grid-cols-2 gap-4"
        >
          {animationOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`animation-${option.id}`} />
              <Label htmlFor={`animation-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default BackgroundTab;
