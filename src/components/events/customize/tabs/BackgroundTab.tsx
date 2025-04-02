
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { useCustomization } from "../context";
import { Button } from "@/components/ui/button";
import { BackgroundType, AnimationType } from "@/types/event.types";

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

const gradientDirections = [
  { id: "to-r", label: "→ Right" },
  { id: "to-l", label: "← Left" },
  { id: "to-b", label: "↓ Bottom" },
  { id: "to-t", label: "↑ Top" },
  { id: "to-br", label: "↘ Bottom Right" },
  { id: "to-bl", label: "↙ Bottom Left" },
  { id: "to-tr", label: "↗ Top Right" },
  { id: "to-tl", label: "↖ Top Left" },
];

const BackgroundTab = () => {
  const {
    customization,
    handleBackgroundChange,
    handleBackgroundAngleChange,
    handleBackgroundDirectionChange,
    handleHeaderImageChange,
    handleAnimationChange,
  } = useCustomization();

  // Default to solid if type is not set
  const backgroundType = customization.background?.type || "solid";

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
            handleBackgroundChange(value as BackgroundType, 
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
            value={customization.background?.value || "#ffffff"}
            onChange={(value) => handleBackgroundChange("solid", value)}
          />
        </div>
      )}

      {backgroundType === "gradient" && (
        <div className="space-y-4">
          <div>
            <Label>Gradient Angle</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Slider
                value={[customization.background?.angle || 135]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => handleBackgroundAngleChange(value[0])}
              />
              <span className="text-sm font-medium w-12 text-right">
                {customization.background?.angle || 135}°
              </span>
            </div>
          </div>

          <div>
            <Label>Gradient Direction</Label>
            <RadioGroup
              value={customization.background?.direction || "to-r"}
              onValueChange={handleBackgroundDirectionChange}
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
        </div>
      )}

      {backgroundType === "image" && (
        <div className="space-y-4">
          <Label>Image URL</Label>
          <Input
            value={customization.background?.value || ""}
            onChange={(e) => handleBackgroundChange("image", e.target.value)}
            placeholder="Enter image URL"
          />
          
          {customization.headerImage && (
            <div className="flex flex-col space-y-2">
              <Label>Header Image</Label>
              <Input
                value={customization.headerImage}
                onChange={(e) => handleHeaderImageChange(e.target.value)}
                placeholder="Enter header image URL"
              />
            </div>
          )}
        </div>
      )}

      {/* Animation settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Animation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose animation style for the event card
        </p>

        <RadioGroup
          value={customization.animation || "fade"}
          onValueChange={(value) => {
            const animationType = value as AnimationType;
            if (animationType !== "none") {
              handleAnimationChange(animationType);
            } else {
              // Handle 'none' separately if needed
              handleAnimationChange(undefined);
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
