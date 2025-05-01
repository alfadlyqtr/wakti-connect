
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from '@/components/ui/color-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

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
  // Add this prop to match how it's used in SimpleInvitationCreator
  value?: FontProps;
  onChange?: (property: string, value: string) => void;
}

export default function FontSelector({
  font,
  onFontChange,
  showAlignment = false,
  showWeight = false,
  previewText = "The quick brown fox jumps over the lazy dog",
  value,
  onChange
}: FontSelectorProps) {
  // Use provided props or fallback to direct props
  const effectiveFont = value || font;
  
  const handleFontChange = (property: string, newValue: string) => {
    if (onChange) {
      onChange(property, newValue);
    } else if (onFontChange) {
      onFontChange(property, newValue);
    }
  };
  
  const fontFamilies = [
    { value: 'system-ui, sans-serif', label: 'System Default' },
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
          value={effectiveFont.family} 
          onValueChange={(value) => handleFontChange('family', value)}
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
          value={effectiveFont.size} 
          onValueChange={(value) => handleFontChange('size', value)}
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
        <Label htmlFor="font-color" className="block mb-2">Text Color</Label>
        <HexColorPicker
          color={effectiveFont.color}
          onChange={(color) => handleFontChange('color', color)}
          label="Text Color"
        />
      </div>

      {showWeight && (
        <div>
          <Label className="block mb-2">Font Weight</Label>
          <RadioGroup 
            value={effectiveFont.weight || 'normal'} 
            onValueChange={(value) => handleFontChange('weight', value)}
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
            value={effectiveFont.alignment || 'center'} 
            onValueChange={(value) => {
              if (value) handleFontChange('alignment', value);
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
            <ToggleGroupItem value="justify" aria-label="Justify text">
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      
      <div className="mt-4 p-4 border rounded-md">
        <Label className="block mb-2 text-sm text-muted-foreground">Preview</Label>
        <p 
          className="break-words"
          style={{ 
            fontFamily: effectiveFont.family,
            fontSize: effectiveFont.size === 'small' ? '0.875rem' : effectiveFont.size === 'medium' ? '1rem' : '1.25rem',
            color: effectiveFont.color,
            fontWeight: effectiveFont.weight === 'bold' ? 'bold' : effectiveFont.weight === 'medium' ? '500' : 'normal',
            textAlign: effectiveFont.alignment as any || 'center'
          }}
        >
          {previewText}
        </p>
      </div>
    </div>
  );
}
