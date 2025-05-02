
import React from "react";
import { useCustomization } from "../context";
import { Label } from "@/components/ui/label";
import { CardEffectType, CardEffect } from "@/types/event.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const CardEffectTabContent: React.FC = () => {
  const { customization, handleCardEffectChange, handleBorderRadiusChange } = useCustomization();
  
  const effect = customization.cardEffect || { type: 'shadow' };
  
  const handleEffectChange = (type: CardEffectType) => {
    const updatedEffect: CardEffect = {
      ...effect,
      type
    };
    handleCardEffectChange(updatedEffect);
  };
  
  const handleRadiusChange = (radius: "none" | "small" | "medium" | "large") => {
    const updatedEffect: CardEffect = {
      ...effect,
      borderRadius: radius
    };
    handleBorderRadiusChange(radius);
  };
  
  const handleBorderToggle = (hasBorder: boolean) => {
    const updatedEffect: CardEffect = {
      ...effect,
      border: hasBorder
    };
    handleCardEffectChange(updatedEffect);
  };
  
  return (
    <div className="space-y-6">
      {/* Card Effect Type */}
      <div className="space-y-2">
        <Label>Card Effect</Label>
        <RadioGroup 
          defaultValue={effect.type || 'shadow'} 
          value={effect.type || 'shadow'} 
          onValueChange={(value) => handleEffectChange(value as CardEffectType)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shadow" id="shadow" />
            <Label htmlFor="shadow">Shadow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="matte" id="matte" />
            <Label htmlFor="matte">Matte</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gloss" id="gloss" />
            <Label htmlFor="gloss">Gloss</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Border Radius */}
      <div className="space-y-2">
        <Label>Border Radius</Label>
        <RadioGroup 
          defaultValue={effect.borderRadius || 'medium'} 
          value={effect.borderRadius || 'medium'}
          onValueChange={(value) => handleRadiusChange(value as "none" | "small" | "medium" | "large")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="radius-none" />
            <Label htmlFor="radius-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="radius-small" />
            <Label htmlFor="radius-small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="radius-medium" />
            <Label htmlFor="radius-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="radius-large" />
            <Label htmlFor="radius-large">Large</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Border Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="border-toggle">Show Border</Label>
        <Switch 
          id="border-toggle"
          checked={effect.border === true}
          onCheckedChange={handleBorderToggle}
        />
      </div>
    </div>
  );
};

export default CardEffectTabContent;
