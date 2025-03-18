
import React from "react";
import ButtonStyleSelector from "../ButtonStyleSelector";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ButtonsTabProps {
  customization: EventCustomization;
  onButtonStyleChange: (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => void;
  onToggleButtons?: (checked: boolean) => void;
}

const ButtonsTab: React.FC<ButtonsTabProps> = ({
  customization,
  onButtonStyleChange,
  onToggleButtons
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-buttons">Show Accept/Decline Buttons</Label>
        <Switch 
          id="show-buttons" 
          checked={customization.showAcceptDeclineButtons !== false}
          onCheckedChange={(checked) => onToggleButtons && onToggleButtons(checked)}
        />
      </div>
      
      <ButtonStyleSelector 
        acceptButton={customization.buttons.accept}
        declineButton={customization.buttons.decline}
        onButtonStyleChange={onButtonStyleChange}
      />
    </div>
  );
};

export default ButtonsTab;
