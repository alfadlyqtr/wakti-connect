
import React, { useState, useEffect } from "react";
import ColorInputs from "./ColorInputs";
import AngleSlider from "./AngleSlider";
import DirectionButtons from "./DirectionButtons";
import GradientPresets from "./GradientPresets";
import GradientPreview from "./GradientPreview";
import { GRADIENT_DIRECTIONS, GRADIENT_PRESETS } from "./constants";
import { generateGradient, directionToAngle, extractColorsFromGradient } from "./utils";
import { GradientTabProps } from "./types";

const GradientTab: React.FC<GradientTabProps> = ({
  value,
  onChange,
  direction = 'to-right',
  angle = 90,
  onDirectionChange,
  onAngleChange
}) => {
  const [color1, setColor1] = useState("#f6d365");
  const [color2, setColor2] = useState("#fda085");
  const [currentAngle, setCurrentAngle] = useState(angle);
  const [currentDirection, setCurrentDirection] = useState(direction);
  const [gradientPreview, setGradientPreview] = useState(value);
  
  useEffect(() => {
    // Extract colors from the gradient value if it exists
    if (value && value.includes('linear-gradient')) {
      const [extractedColor1, extractedColor2] = extractColorsFromGradient(value);
      setColor1(extractedColor1);
      setColor2(extractedColor2);
    }
    
    // Set the current angle from props
    setCurrentAngle(angle);
    setCurrentDirection(direction);
    
    // Update gradient preview
    setGradientPreview(value);
  }, [value, angle, direction]);

  // Handle direction change
  const handleDirectionChange = (newDirection: string) => {
    setCurrentDirection(newDirection);
    
    // Convert direction to angle for the gradient
    const newAngle = directionToAngle(newDirection);
    setCurrentAngle(newAngle);
    
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
    
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    
    const newGradient = generateGradient(color1, color2, newAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
  };

  // Handle angle change
  const handleAngleChange = (newAngle: number) => {
    setCurrentAngle(newAngle);
    
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    
    const newGradient = generateGradient(color1, color2, newAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
  };

  // Handle color changes
  const handleColor1Change = (newColor: string) => {
    setColor1(newColor);
    const newGradient = generateGradient(newColor, color2, currentAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
  };
  
  const handleColor2Change = (newColor: string) => {
    setColor2(newColor);
    const newGradient = generateGradient(color1, newColor, currentAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
  };

  // Select a preset gradient
  const handlePresetSelect = (preset: string) => {
    setGradientPreview(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-6">
      <ColorInputs 
        color1={color1} 
        color2={color2} 
        onColor1Change={handleColor1Change} 
        onColor2Change={handleColor2Change} 
      />
      
      <AngleSlider angle={currentAngle} onAngleChange={handleAngleChange} />
      
      <DirectionButtons 
        directions={GRADIENT_DIRECTIONS} 
        currentDirection={currentDirection} 
        onDirectionChange={handleDirectionChange} 
      />
      
      <GradientPresets 
        presets={GRADIENT_PRESETS} 
        currentValue={gradientPreview} 
        onPresetSelect={handlePresetSelect} 
      />
      
      <GradientPreview gradientValue={gradientPreview} />
    </div>
  );
};

export default GradientTab;
