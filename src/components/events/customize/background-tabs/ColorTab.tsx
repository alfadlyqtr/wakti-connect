
import React from "react";
import { Label } from "@/components/ui/label";

interface ColorTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorTab: React.FC<ColorTabProps> = ({
  value,
  onChange
}) => {
  // Default colors palette
  const colorPalette = [
    "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", 
    "#6c757d", "#495057", "#343a40", "#212529", "#000000",
    "#f8d7da", "#f1aeb5", "#f44336", "#b71c1c", "#7f0000",
    "#d1e7dd", "#a3cfbb", "#4caf50", "#2e7d32", "#1b5e20",
    "#cff4fc", "#9eeaf9", "#03a9f4", "#0277bd", "#01579b",
    "#fff3cd", "#ffe69c", "#ffc107", "#f57f17", "#ff6f00",
    "#d0d0f0", "#b0b0e0", "#3f51b5", "#283593", "#1a237e",
    "#e2d3f4", "#c5a3e0", "#9c27b0", "#6a1b9a", "#4a148c"
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="color-picker" className="block mb-2">Choose Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="color-picker"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer rounded-md border"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-10 px-3 py-2 border rounded-md"
            placeholder="#000000"
          />
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Color Palette</Label>
        <div className="grid grid-cols-5 gap-2">
          {colorPalette.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-full aspect-square rounded-md border ${
                value === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div 
          className="h-14 rounded-md border"
          style={{ backgroundColor: value }}
        ></div>
      </div>
    </div>
  );
};

export default ColorTab;
