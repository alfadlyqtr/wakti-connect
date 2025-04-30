
import React, { useCallback } from "react";
import { Label } from "@/components/ui/label";

interface ColorTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorTab: React.FC<ColorTabProps> = ({
  value,
  onChange
}) => {
  // Expanded color palette with more options
  const colorPalette = [
    // Whites and Light Grays
    "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", 
    // Gray and Dark tones
    "#6c757d", "#495057", "#343a40", "#212529", "#000000",
    // Reds
    "#f8d7da", "#f1aeb5", "#f44336", "#b71c1c", "#7f0000",
    // Greens
    "#d1e7dd", "#a3cfbb", "#4caf50", "#2e7d32", "#1b5e20",
    // Blues
    "#cff4fc", "#9eeaf9", "#03a9f4", "#0277bd", "#01579b",
    // Yellows
    "#fff3cd", "#ffe69c", "#ffc107", "#f57f17", "#ff6f00",
    // Purples
    "#d0d0f0", "#b0b0e0", "#3f51b5", "#283593", "#1a237e",
    // Pinks
    "#e2d3f4", "#c5a3e0", "#9c27b0", "#6a1b9a", "#4a148c"
  ];

  // Trendy colors for 2024
  const trendyColors = [
    "#9b87f5", // Primary Purple
    "#7E69AB", // Secondary Purple
    "#D6BCFA", // Light Purple
    "#8B5CF6", // Vivid Purple
    "#D946EF", // Magenta Pink
    "#F97316", // Bright Orange
    "#0EA5E9", // Ocean Blue
    "#1EAEDB", // Bright Blue
    "#33C3F0", // Sky Blue
    "#0FA0CE"  // Bright Blue
  ];

  // Enhanced handlers with proper event isolation
  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  const handleTextInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  const handleColorButtonClick = useCallback((color: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(color);
  }, [onChange]);

  // Universal event stopper
  const stopPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return (
    <div 
      className="space-y-4" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <div>
        <Label htmlFor="color-picker" className="block mb-2">Choose Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="color-picker"
            value={value}
            onChange={handleColorInputChange}
            className="w-12 h-10 p-1 cursor-pointer rounded-md border"
            onClick={stopPropagation}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
          />
          <input
            type="text"
            value={value}
            onChange={handleTextInputChange}
            className="flex-1 h-10 px-3 py-2 border rounded-md"
            placeholder="#000000"
            onClick={stopPropagation}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
          />
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Trendy Colors</Label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {trendyColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-full aspect-square rounded-md border ${
                value === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorButtonClick(color, e)}
              onMouseDown={stopPropagation}
              onPointerDown={stopPropagation}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Color Palette</Label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {colorPalette.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-full aspect-square rounded-md border ${
                value === color ? 'ring-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorButtonClick(color, e)}
              onMouseDown={stopPropagation}
              onPointerDown={stopPropagation}
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
