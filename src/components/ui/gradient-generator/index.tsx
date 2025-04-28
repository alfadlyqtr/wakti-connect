
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface GradientGeneratorProps {
  value: string;
  onChange: (value: string) => void;
  angle?: number;
  direction?: string;
  onAngleChange?: (angle: number) => void;
  onDirectionChange?: (direction: string) => void;
}

export const GradientGenerator: React.FC<GradientGeneratorProps> = ({
  value,
  onChange,
  angle = 90,
  direction = "to right",
  onAngleChange,
  onDirectionChange,
}) => {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#8b5cf6");
  const [currentAngle, setCurrentAngle] = useState(angle);

  useEffect(() => {
    // Parse initial gradient value if provided
    if (value && value.includes("linear-gradient")) {
      const colors = value.match(/#[a-fA-F0-9]{6}/g);
      if (colors && colors.length >= 2) {
        setColor1(colors[0]);
        setColor2(colors[1]);
      }
    }
  }, [value]);

  const handleColorChange = (index: number, newColor: string) => {
    if (index === 0) {
      setColor1(newColor);
    } else {
      setColor2(newColor);
    }
    updateGradient(index === 0 ? newColor : color1, index === 1 ? newColor : color2);
  };

  const updateGradient = (c1: string, c2: string) => {
    const gradientValue = `linear-gradient(${currentAngle}deg, ${c1}, ${c2})`;
    onChange(gradientValue);
  };

  const handleAngleChange = (newAngle: number) => {
    setCurrentAngle(newAngle);
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    updateGradient(color1, color2);
  };

  const handleDirectionClick = (newDirection: string) => {
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
    let newAngle = 90;
    switch (newDirection) {
      case "to right": newAngle = 90; break;
      case "to left": newAngle = 270; break;
      case "to bottom": newAngle = 180; break;
      case "to top": newAngle = 0; break;
    }
    handleAngleChange(newAngle);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-background">
        <div
          className="w-full h-24 rounded-md"
          style={{ background: `linear-gradient(${currentAngle}deg, ${color1}, ${color2})` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Color 1</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color1}
              onChange={(e) => handleColorChange(0, e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={color1}
              onChange={(e) => handleColorChange(0, e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Color 2</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color2}
              onChange={(e) => handleColorChange(1, e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={color2}
              onChange={(e) => handleColorChange(1, e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Angle: {currentAngle}°</Label>
        <Slider
          value={[currentAngle]}
          min={0}
          max={360}
          step={1}
          onValueChange={(values) => handleAngleChange(values[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Direction</Label>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={direction === "to left" ? "default" : "outline"}
            size="icon"
            onClick={() => handleDirectionClick("to left")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={direction === "to right" ? "default" : "outline"}
            size="icon"
            onClick={() => handleDirectionClick("to right")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant={direction === "to top" ? "default" : "outline"}
            size="icon"
            onClick={() => handleDirectionClick("to top")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant={direction === "to bottom" ? "default" : "outline"}
            size="icon"
            onClick={() => handleDirectionClick("to bottom")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
