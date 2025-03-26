
import React, { useState, useEffect } from "react";
import { DirectionButtons } from "./DirectionButtons";
import { AngleSlider } from "./AngleSlider";
import { ColorInputs } from "./ColorInputs";
import { GradientPreview } from "./GradientPreview";
import { GradientPresets } from "./GradientPresets";
import { DEFAULT_GRADIENT } from "./constants";
import { GradientTabProps } from "./types";

export const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
  direction = DEFAULT_GRADIENT.direction,
  onDirectionChange,
  angle = DEFAULT_GRADIENT.angle,
  onAngleChange,
}) => {
  const [colors, setColors] = useState<string[]>(DEFAULT_GRADIENT.colors);
  const [currentDirection, setCurrentDirection] = useState(direction);
  const [currentAngle, setCurrentAngle] = useState(angle);

  // Update local state when props change
  useEffect(() => {
    setCurrentDirection(direction);
  }, [direction]);

  useEffect(() => {
    setCurrentAngle(angle);
  }, [angle]);

  // Generate linear gradient string
  const buildGradient = () => {
    if (currentDirection.includes("to-")) {
      return `linear-gradient(${currentDirection}, ${colors.join(", ")})`;
    } else {
      return `linear-gradient(${currentAngle}deg, ${colors.join(", ")})`;
    }
  };

  // Update the gradient value whenever components change
  useEffect(() => {
    const newGradient = buildGradient();
    onChange(newGradient);
  }, [colors, currentDirection, currentAngle]);

  // Handler for color changes
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  // Handler for direction changes
  const handleDirectionChange = (newDirection: string) => {
    setCurrentDirection(newDirection);
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
  };

  // Handler for angle changes
  const handleAngleChange = (newAngle: number) => {
    setCurrentAngle(newAngle);
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
  };

  // Handler for preset selection
  const handlePresetClick = (preset: string) => {
    onChange(preset);
    // Extract colors and direction from preset
    const match = preset.match(/linear-gradient\((.*?),\s*(.*?)\)/);
    if (match && match.length >= 3) {
      const directionOrAngle = match[1].trim();
      const colorsList = match[2].split(',').map(c => c.trim());
      
      if (directionOrAngle.includes('to ')) {
        setCurrentDirection(directionOrAngle);
        if (onDirectionChange) onDirectionChange(directionOrAngle);
      } else if (directionOrAngle.endsWith('deg')) {
        const deg = parseInt(directionOrAngle);
        setCurrentAngle(deg);
        if (onAngleChange) onAngleChange(deg);
      }
      
      setColors(colorsList);
    }
  };

  return (
    <div className="space-y-4">
      <GradientPreview 
        gradient={buildGradient()} 
      />
      
      <ColorInputs 
        colors={colors} 
        onColorChange={handleColorChange} 
      />
      
      <DirectionButtons 
        selectedDirection={currentDirection} 
        onDirectionChange={handleDirectionChange} 
      />
      
      <AngleSlider 
        value={currentAngle}
        onChange={handleAngleChange}
      />
      
      <GradientPresets 
        onPresetClick={handlePresetClick} 
      />
    </div>
  );
};
