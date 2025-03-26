
import React from "react";
import { ColorPicker } from "@/components/ui/color-picker";

interface ColorInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({ 
  id, 
  value, 
  onChange,
  className
}) => {
  return (
    <div className={className}>
      <ColorPicker value={value} onChange={onChange} />
    </div>
  );
};
