
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HexColorPicker } from 'react-colorful';

interface FontSelectorProps {
  font: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: string;
  };
  onFontChange: (property: string, value: string) => void;
  // For backward compatibility
  value?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: string;
  };
  onChange?: (property: string, value: string) => void;
}

export default function FontSelector({
  font,
  onFontChange,
  value,
  onChange
}: FontSelectorProps) {
  // For backward compatibility, use value props if the direct props are not provided
  const fontData = font || value || {
    family: 'system-ui, sans-serif',
    size: 'medium',
    color: '#000000'
  };
  
  // Use the appropriate handler
  const handleChange = (property: string, value: string) => {
    if (onChange) {
      onChange(property, value);
    }
    if (onFontChange) {
      onFontChange(property, value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={fontData.family}
          onValueChange={(value) => handleChange('family', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system-ui, sans-serif">System Default</SelectItem>
            <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
            <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
            <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
            <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
            <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
            <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
            <SelectItem value="'Georgia', serif">Georgia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Select
          value={fontData.size}
          onValueChange={(value) => handleChange('size', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Font Weight</Label>
        <Select
          value={fontData.weight || 'normal'}
          onValueChange={(value) => handleChange('weight', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Text Color</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex justify-between"
            >
              <span>Select Color</span>
              <div 
                className="w-4 h-4 rounded-full border" 
                style={{ backgroundColor: fontData.color || '#000000' }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-3">
            <HexColorPicker 
              color={fontData.color || '#000000'} 
              onChange={(color) => handleChange('color', color)}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <RadioGroup
          value={fontData.alignment || 'left'}
          onValueChange={(value) => handleChange('alignment', value)}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="left" id="align-left" />
            <Label htmlFor="align-left">Left</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="center" id="align-center" />
            <Label htmlFor="align-center">Center</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="right" id="align-right" />
            <Label htmlFor="align-right">Right</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
