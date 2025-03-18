
import React from "react";
import { Input } from "@/components/ui/input";

interface ColorTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorTab: React.FC<ColorTabProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 items-center">
      <Input 
        type="color" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 p-1 cursor-pointer"
      />
      <Input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        placeholder="#FFFFFF"
      />
    </div>
  );
};

export default ColorTab;
