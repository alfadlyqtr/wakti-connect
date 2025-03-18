
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface CardEffectSelectorProps {
  value: {
    type: 'shadow' | 'matte' | 'gloss';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
    border?: boolean;
    borderColor?: string;
  };
  onChange: (value: any) => void;
}

const CardEffectSelector: React.FC<CardEffectSelectorProps> = ({
  value,
  onChange
}) => {
  const handleTypeChange = (type: 'shadow' | 'matte' | 'gloss') => {
    onChange({
      ...value,
      type
    });
  };

  const handleBorderRadiusChange = (radius: 'none' | 'small' | 'medium' | 'large') => {
    onChange({
      ...value,
      borderRadius: radius
    });
  };

  const handleBorderToggle = (enabled: boolean) => {
    onChange({
      ...value,
      border: enabled
    });
  };

  const handleBorderColorChange = (color: string) => {
    onChange({
      ...value,
      borderColor: color
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Card Finish</Label>
        <RadioGroup 
          value={value.type} 
          onValueChange={handleTypeChange}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shadow" id="card-shadow" />
            <Label htmlFor="card-shadow">Shadow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="matte" id="card-matte" />
            <Label htmlFor="card-matte">Matte</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gloss" id="card-gloss" />
            <Label htmlFor="card-gloss">Gloss</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label htmlFor="card-radius" className="block mb-2">Corner Roundness</Label>
        <Select
          value={value.borderRadius || 'medium'}
          onValueChange={handleBorderRadiusChange}
        >
          <SelectTrigger id="card-radius">
            <SelectValue placeholder="Select roundness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="card-border" className="block">Card Border</Label>
        <Switch 
          id="card-border"
          checked={value.border || false}
          onCheckedChange={handleBorderToggle}
        />
      </div>

      {value.border && (
        <div>
          <Label htmlFor="border-color" className="block mb-2">Border Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color"
              id="border-color"
              value={value.borderColor || "#e2e8f0"}
              onChange={(e) => handleBorderColorChange(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text"
              value={value.borderColor || "#e2e8f0"}
              onChange={(e) => handleBorderColorChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="shadow-lg bg-white rounded-lg h-20 flex items-center justify-center text-center">
          Shadow
        </div>
        <div className="shadow-sm bg-white bg-opacity-90 rounded-lg h-20 flex items-center justify-center text-center">
          Matte
        </div>
        <div className="shadow-lg bg-white bg-opacity-95 backdrop-blur-sm border-opacity-30 rounded-lg h-20 flex items-center justify-center text-center">
          Gloss
        </div>
      </div>
    </div>
  );
};

export default CardEffectSelector;
