
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
  
  // Extract colors from the gradient value when component mounts or updates
  useEffect(() => {
    if (value && value.includes('linear-gradient')) {
      const [extractedColor1, extractedColor2] = extractColorsFromGradient(value);
      if (extractedColor1 && extractedColor2) {
        setColor1(extractedColor1);
        setColor2(extractedColor2);
      }
    }
    
    // Set the current angle/direction from props
    setCurrentAngle(angle);
    setCurrentDirection(direction);
    
    // Update gradient preview
    setGradientPreview(value);
    
    // Log for debugging
    console.log("GradientTab updated with:", { value, angle, direction });
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
    
    console.log("Direction changed:", { newDirection, newAngle, newGradient });
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
    
    console.log("Angle changed:", { newAngle, newGradient });
  };

  // Handle color changes
  const handleColor1Change = (newColor: string) => {
    setColor1(newColor);
    const newGradient = generateGradient(newColor, color2, currentAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
    
    console.log("Color1 changed:", { newColor, newGradient });
  };
  
  const handleColor2Change = (newColor: string) => {
    setColor2(newColor);
    const newGradient = generateGradient(color1, newColor, currentAngle);
    setGradientPreview(newGradient);
    onChange(newGradient);
    
    console.log("Color2 changed:", { newColor, newGradient });
  };

  // Select a preset gradient
  const handlePresetSelect = (preset: string) => {
    setGradientPreview(preset);
    onChange(preset);
    
    // Also update colors when selecting a preset
    const [extractedColor1, extractedColor2] = extractColorsFromGradient(preset);
    if (extractedColor1 && extractedColor2) {
      setColor1(extractedColor1);
      setColor2(extractedColor2);
    }
    
    console.log("Preset selected:", { preset });
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
