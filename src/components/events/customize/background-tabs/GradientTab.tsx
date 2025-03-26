import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface GradientTabProps {
  value: string;
  onChange: (value: string) => void;
  direction?: string;
  angle?: number;
  onDirectionChange?: (direction: string) => void;
  onAngleChange?: (angle: number) => void;
}

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
  
  useEffect(() => {
    // Extract colors from the gradient value if it exists
    if (value && value.includes('linear-gradient')) {
      try {
        const colorsMatch = value.match(/rgba?\([\d\s,.]+\)|#[0-9a-f]{3,8}/gi);
        if (colorsMatch && colorsMatch.length >= 2) {
          setColor1(colorsMatch[0]);
          setColor2(colorsMatch[1]);
        }
      } catch (e) {
        // Keep default colors if parsing fails
      }
    }
  }, []);
  
  // Preset gradients
  const gradientPresets = [
    'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
    'linear-gradient(180deg, rgb(254,100,121) 0%, rgb(251,221,186) 100%)',
    'linear-gradient(to right, #243949 0%, #517fa4 100%)',
    'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(to right, #ee9ca7, #ffdde1)',
    'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
    'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)',
    'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    'linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)',
    'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)',
    'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)'
  ];

  // Direction options
  const directions = [
    { value: 'to-right', label: 'Right', icon: '→' },
    { value: 'to-left', label: 'Left', icon: '←' },
    { value: 'to-bottom', label: 'Down', icon: '↓' },
    { value: 'to-top', label: 'Up', icon: '↑' },
    { value: 'to-bottom-right', label: 'Bottom Right', icon: '↘' },
    { value: 'to-bottom-left', label: 'Bottom Left', icon: '↙' },
    { value: 'to-top-right', label: 'Top Right', icon: '↗' },
    { value: 'to-top-left', label: 'Top Left', icon: '↖' }
  ];

  // Generate a gradient string based on colors, angle, and direction
  const generateGradient = (customColor1: string, customColor2: string, customAngle: number) => {
    return `linear-gradient(${customAngle}deg, ${customColor1} 0%, ${customColor2} 100%)`;
  };

  // Handle direction change
  const handleDirectionChange = (newDirection: string) => {
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
    
    // Convert direction to angle for the gradient
    let newAngle = angle;
    switch (newDirection) {
      case 'to-right': newAngle = 90; break;
      case 'to-left': newAngle = 270; break;
      case 'to-bottom': newAngle = 180; break;
      case 'to-top': newAngle = 0; break;
      case 'to-bottom-right': newAngle = 135; break;
      case 'to-bottom-left': newAngle = 225; break;
      case 'to-top-right': newAngle = 45; break;
      case 'to-top-left': newAngle = 315; break;
      default: newAngle = 90;
    }
    
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    
    onChange(generateGradient(color1, color2, newAngle));
  };

  // Handle angle change
  const handleAngleChange = (newAngle: number) => {
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    onChange(generateGradient(color1, color2, newAngle));
  };

  // Handle color changes
  const handleColorChange = (colorIndex: 1 | 2, newColor: string) => {
    if (colorIndex === 1) {
      setColor1(newColor);
      onChange(generateGradient(newColor, color2, angle));
    } else {
      setColor2(newColor);
      onChange(generateGradient(color1, newColor, angle));
    }
  };

  // Select a preset gradient
  const selectPreset = (preset: string) => {
    onChange(preset);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color1" className="block mb-2">Start Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="color1"
              value={color1}
              onChange={(e) => handleColorChange(1, e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={color1}
              onChange={(e) => handleColorChange(1, e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="color2" className="block mb-2">End Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="color2"
              value={color2}
              onChange={(e) => handleColorChange(2, e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={color2}
              onChange={(e) => handleColorChange(2, e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="angle" className="block mb-2">Angle: {angle}°</Label>
        <Slider
          id="angle"
          min={0}
          max={360}
          step={1}
          value={[angle]}
          onValueChange={(values) => handleAngleChange(values[0])}
          className="py-4"
        />
      </div>
      
      <div>
        <Label className="block mb-2">Direction</Label>
        <div className="grid grid-cols-4 gap-2">
          {directions.map((dir) => (
            <button
              key={dir.value}
              type="button"
              onClick={() => handleDirectionChange(dir.value)}
              className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
                direction === dir.value ? 'bg-primary/10 border-primary' : 'border-border hover:bg-accent/50'
              }`}
            >
              <span className="text-xl">{dir.icon}</span>
              <span className="text-xs mt-1">{dir.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Gradient Presets</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {gradientPresets.map((preset, index) => (
            <button
              key={index}
              type="button"
              className={`h-12 rounded-md border ${
                value === preset ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundImage: preset }}
              onClick={() => selectPreset(preset)}
              aria-label={`Gradient preset ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <Label className="block mb-2">Preview</Label>
        <div 
          className="h-16 rounded-md"
          style={{ backgroundImage: value }}
        ></div>
      </div>
    </div>
  );
};

export default GradientTab;
