
import React from "react";
import ButtonStyleSelector from "../ButtonStyleSelector";
import { EventCustomization } from "@/types/event.types";

interface ButtonsTabProps {
  customization: EventCustomization;
  onButtonStyleChange: (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => void;
}

const ButtonsTab: React.FC<ButtonsTabProps> = ({
  customization,
  onButtonStyleChange
}) => {
  return (
    <div className="space-y-4">
      <ButtonStyleSelector 
        acceptButton={customization.buttons.accept}
        declineButton={customization.buttons.decline}
        onButtonStyleChange={onButtonStyleChange}
      />
    </div>
  );
};

export default ButtonsTab;
