
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorInput } from "@/components/inputs/ColorInput";

interface TextStylerProps {
  fontFamily: string;
  fontSize: string;
  textColor: string;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
}

const FONT_FAMILIES = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
];

const FONT_SIZES = [
  { name: "Small", value: "14px" },
  { name: "Medium", value: "16px" },
  { name: "Large", value: "18px" },
  { name: "X-Large", value: "24px" },
];

export const TextStyler: React.FC<TextStylerProps> = ({
  fontFamily,
  fontSize,
  textColor,
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
}) => {
  return (
    <div className="space-y-4">
      <Label className="font-medium">Text Styling</Label>
      
      <div className="space-y-3">
        <div>
          <Label>Font</Label>
          <Select value={fontFamily} onValueChange={onFontFamilyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value} 
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Size</Label>
          <Select value={fontSize} onValueChange={onFontSizeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Text Color</Label>
          <ColorInput 
            value={textColor} 
            onChange={onTextColorChange} 
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
