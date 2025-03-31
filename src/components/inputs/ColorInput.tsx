
import React from "react";
import { Input } from "@/components/ui/input";

interface ColorInputProps {
  id?: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorInput = ({ id, value, onChange, className }: ColorInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        id={id ? `${id}-color-picker` : undefined}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-9 p-1"
      />
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
};
