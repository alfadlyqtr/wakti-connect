
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
        <Label htmlFor="fontFamily" className="block mb-2">Font Family</Label>
        <Select value={font.family} onValueChange={(value) => onFontChange('family', value)}>
          <SelectTrigger id="fontFamily">
            <SelectValue placeholder="Choose a font" />
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
        <Label htmlFor="fontSize" className="block mb-2">Font Size</Label>
        <RadioGroup 
          value={font.size} 
          onValueChange={(value) => onFontChange('size', value)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="fontSizeSmall" />
            <Label htmlFor="fontSizeSmall" className="text-sm">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="fontSizeMedium" />
            <Label htmlFor="fontSizeMedium" className="text-base">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="fontSizeLarge" />
            <Label htmlFor="fontSizeLarge" className="text-lg">Large</Label>
          </div>
        </RadioGroup>
      </div>
      
      {showWeight && (
        <div>
          <Label htmlFor="fontWeight" className="block mb-2">Font Weight</Label>
          <RadioGroup 
            value={font.weight || 'normal'} 
            onValueChange={(value) => onFontChange('weight', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="fontWeightNormal" />
              <Label htmlFor="fontWeightNormal" className="font-normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="fontWeightMedium" />
              <Label htmlFor="fontWeightMedium" className="font-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bold" id="fontWeightBold" />
              <Label htmlFor="fontWeightBold" className="font-bold">Bold</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {showAlignment && (
        <div>
          <Label htmlFor="fontAlignment" className="block mb-2">Text Alignment</Label>
          <RadioGroup 
            value={font.alignment || 'left'} 
            onValueChange={(value) => onFontChange('alignment', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left" id="fontAlignLeft" />
              <Label htmlFor="fontAlignLeft">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="center" id="fontAlignCenter" />
              <Label htmlFor="fontAlignCenter">Center</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right" id="fontAlignRight" />
              <Label htmlFor="fontAlignRight">Right</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div>
        <Label htmlFor="fontColor" className="block mb-2">Font Color</Label>
        <div className="flex gap-2 items-center">
          <Input 
            type="color" 
            value={font.color} 
            onChange={(e) => onFontChange('color', e.target.value)} 
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input 
            type="text" 
            value={font.color} 
            onChange={(e) => onFontChange('color', e.target.value)} 
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg mb-2 font-semibold">Preview:</h3>
        <div 
          style={{ 
            fontFamily: font.family,
            fontSize: font.size === 'small' ? '0.875rem' : font.size === 'medium' ? '1rem' : '1.25rem',
            color: font.color,
            fontWeight: font.weight === 'bold' ? 'bold' : font.weight === 'medium' ? '500' : 'normal',
            textAlign: font.alignment as any
          }}
        >
          <p className="mb-1">This is how your event text will appear to attendees.</p>
          <p>Customize it to match your brand or event style.</p>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
