
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface TextColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const TextColorPicker: React.FC<TextColorPickerProps> = ({
  value,
  onChange,
  label
}) => {
  const [color, setColor] = useState(value || '#333333');
  
  useEffect(() => {
    if (value && value !== color) {
      setColor(value);
    }
  }, [value]);
  
  // Common text colors
  const colorPresets = [
    '#000000', '#333333', '#555555', '#777777', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC00', '#00CCFF', '#0066FF', '#3300FF',
    '#9900FF', '#FF00FF', '#FF0099'
  ];
  
  // Handle local color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };
  
  // Handle preset color selection
  const handlePresetClick = (presetColor: string) => {
    setColor(presetColor);
    onChange(presetColor);
  };

  // Prevent click propagation for the whole popover content
  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm">{label}</Label>}
      
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-1 border-2"
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-3 z-[100]" 
            onClick={handlePopoverClick}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-4">
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-32 h-32 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="grid grid-cols-8 gap-1">
                {colorPresets.map((presetColor) => (
                  <div
                    key={presetColor}
                    className={`w-6 h-6 rounded-sm cursor-pointer border ${
                      color === presetColor ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetClick(presetColor)}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={color}
          onChange={handleColorChange}
          className="w-28"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
