
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorTab from "./background-tabs/ColorTab";
import { GradientTab } from "./background-tabs/gradient";
import ImageTab from "./background-tabs/ImageTab";

interface BackgroundSelectorProps {
  backgroundType: string;
  backgroundValue: string;
  backgroundAngle?: number;
  backgroundDirection?: string;
  onBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
  onBackgroundAngleChange?: (angle: number) => void;
  onBackgroundDirectionChange?: (direction: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  backgroundAngle = 90,
  backgroundDirection = 'to-right',
  onBackgroundChange,
  onBackgroundAngleChange,
  onBackgroundDirectionChange
}) => {
  const [activeTab, setActiveTab] = useState<string>(backgroundType || 'color');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Set a default value when changing tabs
    if (value === 'color') {
      onBackgroundChange('color', '#ffffff');
    } else if (value === 'gradient') {
      onBackgroundChange('gradient', 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)');
    }
  };

  // Handler for color tab changes
  const handleColorChange = (value: string) => {
    onBackgroundChange('color', value);
  };

  // Handler for gradient tab changes
  const handleGradientChange = (value: string) => {
    onBackgroundChange('gradient', value);
  };

  // Handler for gradient angle changes
  const handleGradientAngleChange = (angle: number) => {
    if (onBackgroundAngleChange) {
      onBackgroundAngleChange(angle);
    }
  };

  // Handler for gradient direction changes
  const handleGradientDirectionChange = (direction: string) => {
    if (onBackgroundDirectionChange) {
      onBackgroundDirectionChange(direction);
    }
  };

  // Handler for image tab changes
  const handleImageChange = (value: string) => {
    onBackgroundChange('image', value);
  };

  return (
    <div className="space-y-4">
      <Label>Background</Label>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="color">Solid Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4">
          <ColorTab 
            value={backgroundType === 'color' ? backgroundValue : '#ffffff'} 
            onChange={handleColorChange} 
          />
        </TabsContent>
        
        <TabsContent value="gradient" className="pt-4">
          <GradientTab 
            value={backgroundType === 'gradient' ? backgroundValue : 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)'} 
            onChange={handleGradientChange} 
            onDirectionChange={handleGradientDirectionChange}
            onAngleChange={handleGradientAngleChange}
            direction={backgroundDirection}
            angle={backgroundAngle}
          />
        </TabsContent>
        
        <TabsContent value="image" className="pt-4">
          <ImageTab 
            value={backgroundType === 'image' ? backgroundValue : ''} 
            onChange={handleImageChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundSelector;
