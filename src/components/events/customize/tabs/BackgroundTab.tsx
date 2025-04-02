import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { BackgroundType, AnimationType } from "@/types/event.types";

interface BackgroundTabProps {
  backgroundType: BackgroundType;
  backgroundValue: string;
  backgroundAngle?: number;
  backgroundDirection?: string;
  headerImage?: string;
  animation?: AnimationType;
  onBackgroundChange: (type: "gradient" | "image" | "color", value: string) => void;
  onBackgroundAngleChange: (angle: number) => void;
  onBackgroundDirectionChange: (direction: string) => void;
  onHeaderImageChange: (imageUrl: string) => void;
  onAnimationChange: (value: "fade" | "slide" | "pop") => void;
}

const backgroundOptions = [
  { id: "color", label: "Solid" },
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
  onAnimationChange
}) => {
  // Convert BackgroundType to the string types expected by the handler
  const getDisplayType = (type: BackgroundType): "color" | "gradient" | "image" => {
    if (type === "solid") return "color";
    return type as "gradient" | "image";
  };

  const displayType = getDisplayType(backgroundType);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Background</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose the background style for your event card
        </p>
        
        <RadioGroup
          value={displayType}
          onValueChange={(value) => {
            onBackgroundChange(value as "color" | "gradient" | "image", 
              value === "color" ? "#ffffff" : 
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
      {displayType === "color" && (
        <div className="space-y-4">
          <Label>Background Color</Label>
          <ColorPickerInput
            value={backgroundValue}
            onChange={(value) => onBackgroundChange("color", value)}
          />
        </div>
      )}

      {displayType === "gradient" && (
        <div className="space-y-4">
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
              onValueChange={onBackgroundDirectionChange}
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

      {displayType === "image" && (
        <div className="space-y-4">
          <Label>Image URL</Label>
          <Input
            value={backgroundValue}
            onChange={(e) => onBackgroundChange("image", e.target.value)}
            placeholder="Enter image URL"
          />
          
          {headerImage && (
            <div className="flex flex-col space-y-2">
              <Label>Header Image</Label>
              <Input
                value={headerImage}
                onChange={(e) => onHeaderImageChange(e.target.value)}
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
          value={animation || "none"}
          onValueChange={(value) => {
            if (value !== "none") {
              onAnimationChange(value as "fade" | "slide" | "pop");
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
