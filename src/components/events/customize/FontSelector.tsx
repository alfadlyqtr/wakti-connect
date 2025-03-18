
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FontSelectorProps {
  font: {
    family: string;
    size: 'small' | 'medium' | 'large';
    color: string;
    weight?: 'normal' | 'medium' | 'bold';
    alignment?: 'left' | 'center' | 'right';
  };
  onFontChange: (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => void;
  showAlignment?: boolean;
  showWeight?: boolean;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  font,
  onFontChange,
  showAlignment = false,
  showWeight = false
}) => {
  const fontFamilies = [
    { name: "System UI", value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Playfair Display", value: "Playfair Display, serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Red Rose", value: "Red Rose, sans-serif" },
    { name: "Cairo", value: "Cairo, sans-serif" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="font-family" className="block mb-2">Font Family</Label>
        <Select 
          value={font.family} 
          onValueChange={(value) => onFontChange('family', value)}
        >
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((fontFamily) => (
              <SelectItem 
                key={fontFamily.name} 
                value={fontFamily.value}
                style={{ fontFamily: fontFamily.value }}
              >
                {fontFamily.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="font-size" className="block mb-2">Font Size</Label>
        <RadioGroup 
          value={font.size} 
          onValueChange={(value) => onFontChange('size', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="font-small" />
            <Label htmlFor="font-small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="font-medium" />
            <Label htmlFor="font-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="font-large" />
            <Label htmlFor="font-large">Large</Label>
          </div>
        </RadioGroup>
      </div>
      
      {showWeight && (
        <div>
          <Label htmlFor="font-weight" className="block mb-2">Font Weight</Label>
          <RadioGroup 
            value={font.weight || 'normal'} 
            onValueChange={(value) => onFontChange('weight', value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="weight-normal" />
              <Label htmlFor="weight-normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="weight-medium" />
              <Label htmlFor="weight-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bold" id="weight-bold" />
              <Label htmlFor="weight-bold">Bold</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div>
        <Label htmlFor="font-color" className="block mb-2">Font Color</Label>
        <div className="flex gap-2">
          <Input 
            type="color"
            id="font-color"
            value={font.color}
            onChange={(e) => onFontChange('color', e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input 
            type="text"
            value={font.color}
            onChange={(e) => onFontChange('color', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      {showAlignment && (
        <div>
          <Label htmlFor="font-alignment" className="block mb-2">Text Alignment</Label>
          <RadioGroup 
            value={font.alignment || 'left'} 
            onValueChange={(value) => onFontChange('alignment', value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left" id="align-left" />
              <Label htmlFor="align-left">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="center" id="align-center" />
              <Label htmlFor="align-center">Center</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right" id="align-right" />
              <Label htmlFor="align-right">Right</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div className="p-3 border rounded-md mt-4">
        <p style={{ 
          fontFamily: font.family,
          fontSize: font.size === 'small' ? '0.875rem' : font.size === 'medium' ? '1rem' : '1.25rem',
          fontWeight: font.weight === 'bold' ? 'bold' : font.weight === 'medium' ? '500' : 'normal',
          color: font.color,
          textAlign: (font.alignment || 'left') as 'left' | 'center' | 'right'
        }}>
          Sample Text
        </p>
      </div>
    </div>
  );
};

export default FontSelector;
