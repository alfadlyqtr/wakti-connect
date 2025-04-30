
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EventSafeColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  id?: string;
  presets?: string[];
}

export const EventSafeColorPicker: React.FC<EventSafeColorPickerProps> = ({
  value,
  onChange,
  label,
  className,
  id,
  presets = [
    '#000000', '#333333', '#555555', '#777777', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC00', '#00CCFF', '#0066FF', '#3300FF',
    '#9900FF', '#FF00FF', '#FF0099'
  ]
}) => {
  const [colorValue, setColorValue] = useState(value || '#333333');
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update internal state when external value changes
  useEffect(() => {
    if (value !== colorValue) {
      setColorValue(value);
    }
  }, [value]);

  // Function to handle color input change with proper event handling
  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    const newColor = e.target.value;
    setColorValue(newColor);
    onChange(newColor);
  }, [onChange]);

  // Function to handle text input change with proper event handling
  const handleTextInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    const newColor = e.target.value;
    setColorValue(newColor);
    
    // Only call onChange for valid color values
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor) || /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/.test(newColor)) {
      onChange(newColor);
    }
  }, [onChange]);

  // Function to handle preset selection with proper event handling
  const handlePresetClick = useCallback((presetColor: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    setColorValue(presetColor);
    onChange(presetColor);
  }, [onChange]);
  
  // Handle popover open state
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && <Label className="text-sm">{label}</Label>}
      
      <div className="flex gap-2 items-center">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-10 h-10 p-0.5 border-2"
              style={{ backgroundColor: colorValue }}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              aria-label="Pick a color"
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-3"
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            onPointerDownCapture={(e) => e.stopPropagation()}
            style={{ zIndex: 9999 }}
          >
            <div className="flex flex-col gap-4">
              <input
                ref={inputRef}
                type="color"
                value={colorValue}
                onChange={handleColorInputChange}
                className="w-32 h-32 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                id={id ? `${id}-color-input` : undefined}
              />
              
              <div className="grid grid-cols-8 gap-1">
                {presets.map((presetColor) => (
                  <div
                    key={presetColor}
                    className={`w-6 h-6 rounded-sm cursor-pointer border ${
                      colorValue === presetColor ? 'ring-2 ring-primary ring-offset-1' : ''
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
          value={colorValue}
          onChange={handleTextInputChange}
          className="w-28 h-10"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          id={id}
        />
      </div>
    </div>
  );
};
