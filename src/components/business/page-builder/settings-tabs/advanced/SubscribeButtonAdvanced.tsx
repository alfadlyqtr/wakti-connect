
import React from "react";
import { Label } from "@/components/ui/label";
import { ColorInput } from "@/components/inputs/ColorInput";

interface SubscribeButtonAdvancedProps {
  primaryColor: string;
  secondaryColor: string;
  handleSelectChange: (name: string, value: string) => void;
}

const SubscribeButtonAdvanced: React.FC<SubscribeButtonAdvancedProps> = ({
  primaryColor,
  secondaryColor,
  handleSelectChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="button_background_color">Custom Background Color</Label>
        <ColorInput
          id="button_background_color"
          value={primaryColor || "#3B82F6"}
          onChange={(color) => handleSelectChange("primary_color", color)}
        />
        <p className="text-xs text-muted-foreground">
          For gradient buttons, this is the start color
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="button_gradient_end">Gradient End Color</Label>
        <ColorInput
          id="button_gradient_end"
          value={secondaryColor || "#10B981"}
          onChange={(color) => handleSelectChange("secondary_color", color)}
        />
        <p className="text-xs text-muted-foreground">
          Only used for gradient style buttons
        </p>
      </div>
    </div>
  );
};

export default SubscribeButtonAdvanced;
