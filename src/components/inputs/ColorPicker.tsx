
import React from 'react';
import { useColorInput } from '@/hooks/useColorInput';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, className = '' }) => {
  const { color, setColor } = useColorInput(value);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input 
        type="color" 
        value={color} 
        onChange={handleColorChange}
        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
      />
      <input 
        type="text" 
        value={color} 
        onChange={handleColorChange}
        className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
