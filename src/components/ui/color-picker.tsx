
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HexColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export const HexColorPicker = ({ color, onChange, label, className }: HexColorPickerProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: color }}></div>
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-0 overflow-hidden"
        />
        <Input 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
          className="flex-1"
        />
      </div>
    </div>
  );
};
