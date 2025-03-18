
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface FontProps {
  family: string;
  size: string;
  color: string;
  weight?: string;
  alignment?: string;
}

interface FontSelectorProps {
  font: FontProps;
  onFontChange: (property: string, value: string) => void;
  showAlignment?: boolean;
  showWeight?: boolean;
  previewText?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  font,
  onFontChange,
  showAlignment = false,
  showWeight = false,
  previewText = "The quick brown fox jumps over the lazy dog"
}) => {
  const fontFamilies = [
    { value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', label: 'System Default' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
    { value: 'Impact, sans-serif', label: 'Impact' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
    { value: 'Palatino Linotype, serif', label: 'Palatino Linotype' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Lucida Sans Unicode, sans-serif', label: 'Lucida Sans' },
    { value: 'Garamond, serif', label: 'Garamond' }
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
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((fontFamily) => (
              <SelectItem 
                key={fontFamily.label} 
                value={fontFamily.value}
                style={{ fontFamily: fontFamily.value }}
              >
                {fontFamily.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="font-size" className="block mb-2">Font Size</Label>
        <Select 
          value={font.size} 
          onValueChange={(value) => onFontChange('size', value)}
        >
          <SelectTrigger id="font-size">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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

      {showWeight && (
        <div>
          <Label className="block mb-2">Font Weight</Label>
          <RadioGroup 
            value={font.weight || 'normal'} 
            onValueChange={(value) => onFontChange('weight', value)}
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="weight-normal" />
              <Label htmlFor="weight-normal" className="font-normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="weight-medium" />
              <Label htmlFor="weight-medium" className="font-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bold" id="weight-bold" />
              <Label htmlFor="weight-bold" className="font-bold">Bold</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {showAlignment && (
        <div>
          <Label className="block mb-2">Text Alignment</Label>
          <ToggleGroup 
            type="single" 
            value={font.alignment || 'left'} 
            onValueChange={(value) => {
              if (value) onFontChange('alignment', value);
            }}
            className="flex justify-start"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      
      <div className="mt-4 p-4 border rounded-md">
        <Label className="block mb-2 text-sm text-muted-foreground">Preview</Label>
        <p 
          className="break-words"
          style={{ 
            fontFamily: font.family,
            fontSize: font.size === 'small' ? '0.875rem' : font.size === 'medium' ? '1rem' : '1.25rem',
            color: font.color,
            fontWeight: font.weight === 'bold' ? 'bold' : font.weight === 'medium' ? '500' : 'normal',
            textAlign: font.alignment as any
          }}
        >
          {previewText}
        </p>
      </div>
    </div>
  );
};

export default FontSelector;
