
import React from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface HeaderStyleSelectorProps {
  value: 'banner' | 'simple' | 'minimal';
  onChange: (value: 'banner' | 'simple' | 'minimal') => void;
}

const HeaderStyleSelector: React.FC<HeaderStyleSelectorProps> = ({
  value,
  onChange
}) => {
  // Ensure a valid value is selected
  const safeValue = value || 'simple';
  
  return (
    <div className="space-y-3">
      <Label className="text-base">Header Style</Label>
      
      <ToggleGroup 
        type="single" 
        value={safeValue} 
        onValueChange={(val) => {
          if (val) onChange(val as 'banner' | 'simple' | 'minimal');
        }}
        className="grid grid-cols-3 gap-2"
      >
        <HeaderStyleOption value="banner" current={safeValue} />
        <HeaderStyleOption value="simple" current={safeValue} />
        <HeaderStyleOption value="minimal" current={safeValue} />
      </ToggleGroup>
    </div>
  );
};

interface HeaderStyleOptionProps {
  value: 'banner' | 'simple' | 'minimal';
  current: string;
}

const HeaderStyleOption: React.FC<HeaderStyleOptionProps> = ({ value, current }) => {
  // Preview styles for each header type
  const getPreviewStyle = () => {
    switch (value) {
      case 'banner':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="h-10 bg-purple-500 w-full mb-1"></div>
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
              <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case 'simple':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <div className="w-1/2 h-2 bg-gray-700 rounded"></div>
            <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
            <div className="w-2/3 h-1 bg-gray-300 rounded mt-1"></div>
          </div>
        );
      case 'minimal':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-500 mb-1"></div>
            <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ToggleGroupItem 
      value={value} 
      className="h-20 border data-[state=on]:border-purple-500 data-[state=on]:bg-purple-50 flex flex-col p-1"
      aria-label={`${value} header style`}
    >
      <div className="flex-1 w-full">
        {getPreviewStyle()}
      </div>
      <div className="text-xs capitalize mt-1 text-center font-medium">
        {value}
      </div>
    </ToggleGroupItem>
  );
};

export default HeaderStyleSelector;
