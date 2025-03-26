
import React, { useState, useEffect } from "react";
import { GradientTabProps } from "./types";
import { DEFAULT_GRADIENT, DIRECTIONS } from "./constants";
import DirectionButtons from "./DirectionButtons";
import AngleSlider from "./AngleSlider";
import ColorInputs from "./ColorInputs";
import GradientPresets from "./GradientPresets";
import GradientPreview from "./GradientPreview";

const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
  direction = DEFAULT_GRADIENT.direction,
  angle = DEFAULT_GRADIENT.angle,
  onDirectionChange,
  onAngleChange
}) => {
  const [colors, setColors] = useState<string[]>(DEFAULT_GRADIENT.colors);
  const [gradientDirection, setGradientDirection] = useState<string>(direction);
  const [gradientAngle, setGradientAngle] = useState<number>(angle);
  const [gradientValue, setGradientValue] = useState<string>(value);

  // Update local state when props change
  useEffect(() => {
    setGradientDirection(direction);
  }, [direction]);
  
  useEffect(() => {
    setGradientAngle(angle);
  }, [angle]);

  // Parse gradient value when it changes
  useEffect(() => {
    if (value.includes("linear-gradient")) {
      try {
        // Try to extract colors from the gradient string
        const colorMatch = value.match(/rgba?\([\d\s,.]+\)|#[a-f\d]{3,8}|[a-z]+/gi);
        if (colorMatch && colorMatch.length >= 2) {
          setColors([colorMatch[0], colorMatch[1]]);
        }
      } catch (error) {
        console.error("Error parsing gradient value:", error);
      }
    }
    setGradientValue(value);
  }, [value]);

  // Handle color change
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
    
    // Generate new gradient string
    const newGradient = `linear-gradient(${gradientDirection}, ${newColors[0]}, ${newColors[1]})`;
    setGradientValue(newGradient);
    onChange(newGradient);
  };

  // Handle direction change
  const handleDirectionChange = (newDirection: string) => {
    setGradientDirection(newDirection);
    
    // Generate new gradient string
    const newGradient = `linear-gradient(${newDirection}, ${colors[0]}, ${colors[1]})`;
    setGradientValue(newGradient);
    onChange(newGradient);
    
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
  };

  // Handle angle change
  const handleAngleChange = (newAngle: number) => {
    setGradientAngle(newAngle);
    
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
  };

  // Handle preset selection
  const handlePresetClick = (preset: string) => {
    setGradientValue(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-4">
      <GradientPreview gradient={gradientValue} />
      
      <ColorInputs 
        colors={colors} 
        onColorChange={handleColorChange} 
      />
      
      <DirectionButtons 
        directions={DIRECTIONS} 
        currentDirection={gradientDirection} 
        onDirectionChange={handleDirectionChange} 
      />
      
      <AngleSlider 
        angle={gradientAngle} 
        onAngleChange={handleAngleChange} 
      />
      
      <GradientPresets onPresetClick={handlePresetClick} />
    </div>
  );
};

export default GradientTab;
