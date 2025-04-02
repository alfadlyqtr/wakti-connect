
import React, { useState } from 'react';
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
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onChange(e.target.value);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-10 h-10 p-0 border-2"
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-32 h-32 cursor-pointer"
            />
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={color}
          onChange={handleHexInputChange}
          className="w-28"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};
