
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorTab: React.FC<ColorTabProps> = ({ value, onChange }) => {
  const presetColors = [
    '#ffffff', // White
    '#f8fafc', // Light gray
    '#f1f5f9', // Lighter blue-gray
    '#0ea5e9', // Sky blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308'  // Yellow
  ];
  
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handlePresetClick = (color: string) => {
    onChange(color);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="colorPicker">Select Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="colorPicker"
            type="color"
            value={value}
            onChange={handleColorInputChange}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={value}
            onChange={handleColorInputChange}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "w-full aspect-square rounded-md border border-gray-200",
                value === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
              onClick={() => handlePresetClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorTab;
