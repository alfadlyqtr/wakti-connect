
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  value,
  onChange,
  label,
  className
}) => {
  const [color, setColor] = useState(value || '#ffffff');
  const [isOpen, setIsOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (value !== color) {
      setColor(value);
    }
  }, [value]);
  
  // Common color presets
  const colorPresets = [
    '#000000', '#333333', '#555555', '#777777', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC00', '#00CCFF', '#0066FF', '#3300FF',
    '#9900FF', '#FF00FF', '#FF0099', '#8B5CF6', '#6366F1', '#3B82F6', '#0EA5E9', 
    '#14B8A6', '#10B981', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#EC4899'
  ];
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };
  
  const handlePresetClick = (presetColor: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setColor(presetColor);
    onChange(presetColor);
  };
  
  // Handle popover open state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Stop propagation on container to prevent clicking through
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={className}
      ref={colorRef}
      onClick={handleContainerClick}
    >
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <div className="flex items-center space-x-2" onClick={handleContainerClick}>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button 
              type="button"
              variant="outline" 
              className="w-10 h-10 p-0 border-2"
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-3 border-2 shadow-xl" 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDownOutside={(e) => e.stopPropagation()}
            onInteractOutside={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-32 h-32 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <div className="grid grid-cols-8 gap-1">
                {colorPresets.map((presetColor) => (
                  <div
                    key={presetColor}
                    className={`w-6 h-6 rounded-sm cursor-pointer border ${
                      color === presetColor ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: presetColor }}
                    onClick={(e) => handlePresetClick(presetColor, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={color}
          onChange={handleHexInputChange}
          className="w-28"
          placeholder="#000000"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
