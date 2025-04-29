
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorTab from "./background-tabs/ColorTab";
import ImageTab from "./background-tabs/ImageTab";

interface BackgroundSelectorProps {
  backgroundType: string;
  backgroundValue: string;
  onBackgroundChange: (type: 'color' | 'image', value: string) => void;
  title?: string;
  description?: string;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
  title,
  description
}) => {
  const [activeTab, setActiveTab] = useState<string>(backgroundType || 'color');

  // Update active tab when backgroundType changes from parent
  useEffect(() => {
    if (backgroundType) {
      setActiveTab(backgroundType);
    }
  }, [backgroundType]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Set a default value when changing tabs
    if (value === 'color') {
      onBackgroundChange('color', '#ffffff');
    } else if (value === 'image' && !backgroundValue.startsWith('data:') && !backgroundValue.startsWith('http')) {
      onBackgroundChange('image', '');
    }
  };

  // Handler for color tab changes
  const handleColorChange = (value: string) => {
    onBackgroundChange('color', value);
  };

  // Handler for image tab changes
  const handleImageChange = (value: string) => {
    onBackgroundChange('image', value);
  };

  return (
    <div className="space-y-4">
      <Label>Background</Label>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="color">Solid Color</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4">
          <ColorTab 
            value={backgroundType === 'color' ? backgroundValue : '#ffffff'} 
            onChange={handleColorChange} 
          />
        </TabsContent>
        
        <TabsContent value="image" className="pt-4">
          <ImageTab 
            value={backgroundType === 'image' ? backgroundValue : ''} 
            onChange={handleImageChange}
            title={title}
            description={description}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundSelector;
