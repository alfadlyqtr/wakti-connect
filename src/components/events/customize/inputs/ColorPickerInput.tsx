
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  
  // Handle color change with proper event stopping
  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  }, [onChange]);

  // Handle text input with proper event stopping
  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  }, [onChange]);
  
  // Handle preset click with proper event stopping
  const handlePresetClick = useCallback((presetColor: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setColor(presetColor);
    onChange(presetColor);
  }, [onChange]);
  
  // Handle popover open state
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Universal event stopper
  const stopPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return (
    <div 
      className={className}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <div 
        className="flex items-center space-x-2" 
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
      >
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button 
              type="button"
              variant="outline" 
              className="w-10 h-10 p-0 border-2"
              style={{ backgroundColor: color }}
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onPointerDown={stopPropagation}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-3 border-2 shadow-xl" 
            onClick={stopPropagation}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            onKeyDown={(e) => e.stopPropagation()}
            style={{ zIndex: 99999 }}
          >
            <div 
              className="flex flex-col gap-3" 
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onPointerDown={stopPropagation}
            >
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-32 h-32 cursor-pointer"
                onClick={stopPropagation}
                onMouseDown={stopPropagation}
                onPointerDown={stopPropagation}
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
                    onMouseDown={stopPropagation}
                    onPointerDown={stopPropagation}
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
          onClick={stopPropagation}
          onMouseDown={stopPropagation}
          onPointerDown={stopPropagation}
        />
      </div>
    </div>
  );
};
