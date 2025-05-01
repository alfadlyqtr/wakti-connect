
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundType } from '@/types/invitation.types';
import { HexColorPicker } from 'react-colorful';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

interface BackgroundSelectorProps {
  backgroundType: BackgroundType;
  backgroundValue: string;
  onBackgroundChange: (type: BackgroundType, value: string) => void;
  // For backward compatibility
  value?: { type: BackgroundType; value: string; };
  onChange?: (type: BackgroundType, value: string) => void;
}

export default function BackgroundSelector({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
  value,
  onChange
}: BackgroundSelectorProps) {
  // For backward compatibility, use value props if the direct props are not provided
  const type = backgroundType || value?.type || 'solid';
  const bgValue = backgroundValue || value?.value || '#ffffff';
  
  // Use the appropriate handler
  const handleTypeChange = (newType: BackgroundType) => {
    if (onChange) {
      onChange(newType, bgValue);
    }
    if (onBackgroundChange) {
      onBackgroundChange(newType, bgValue);
    }
  };
  
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(type, newValue);
    }
    if (onBackgroundChange) {
      onBackgroundChange(type, newValue);
    }
  };

  return (
    <Tabs defaultValue="color" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="color">Solid Color</TabsTrigger>
        <TabsTrigger value="gradient">Gradient</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      
      <TabsContent value="color" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Select Background Color</Label>
          <HexColorPicker 
            color={type === 'solid' ? bgValue : '#ffffff'} 
            onChange={handleValueChange} 
            className="w-full"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="gradient" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Gradient Code (CSS)</Label>
          <Input 
            placeholder="linear-gradient(to right, #e66465, #9198e5)" 
            value={type === 'gradient' ? bgValue : ''} 
            onChange={(e) => handleValueChange(e.target.value)}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="image" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input 
            placeholder="https://example.com/image.jpg" 
            value={type === 'image' ? bgValue : ''} 
            onChange={(e) => handleValueChange(e.target.value)}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
