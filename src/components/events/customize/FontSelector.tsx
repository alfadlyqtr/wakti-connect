
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
  };
  onFontChange: (property: 'family' | 'size' | 'color', value: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  font,
  onFontChange
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
    { name: "Montserrat", value: "Montserrat, sans-serif" }
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
            color: font.color 
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
