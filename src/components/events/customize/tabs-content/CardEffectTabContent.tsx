
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCustomization } from "../context";
import { CardEffectType } from "@/types/event.types";
import { CardEffect } from "../context/types";

const CardEffectTabContent = () => {
  const { customization, handleCardEffectChange } = useCustomization();
  
  // Ensure cardEffect exists with a default type
  const cardEffect = customization.cardEffect || {
    type: "shadow" as CardEffectType,
    borderRadius: "medium",
    border: false
  };

  const handleEffectTypeChange = (type: CardEffectType) => {
    const updatedEffect: CardEffect = {
      ...cardEffect,
      type
    };
    handleCardEffectChange(updatedEffect);
  };

  const handleBorderRadiusChange = (borderRadius: "none" | "small" | "medium" | "large") => {
    const updatedEffect: CardEffect = {
      ...cardEffect,
      borderRadius
    };
    handleCardEffectChange(updatedEffect);
  };

  const handleBorderToggle = (border: boolean) => {
    const updatedEffect: CardEffect = {
      ...cardEffect,
      border
    };
    handleCardEffectChange(updatedEffect);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Card Effect</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the appearance of your event card
        </p>
        
        <div className="space-y-4">
          <div>
            <Label>Effect Type</Label>
            <RadioGroup
              value={cardEffect.type}
              onValueChange={(value) => handleEffectTypeChange(value as CardEffectType)}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shadow" id="effect-shadow" />
                <Label htmlFor="effect-shadow">Shadow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="matte" id="effect-matte" />
                <Label htmlFor="effect-matte">Matte</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gloss" id="effect-gloss" />
                <Label htmlFor="effect-gloss">Gloss</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Border Radius</Label>
            <Select 
              value={cardEffect.borderRadius || "medium"}
              onValueChange={(value) => handleBorderRadiusChange(value as "none" | "small" | "medium" | "large")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select border radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Show Border</Label>
            <Switch
              checked={cardEffect.border || false}
              onCheckedChange={handleBorderToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEffectTabContent;
