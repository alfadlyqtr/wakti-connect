
import React from "react";
import ButtonStyleSelector from "../ButtonStyleSelector";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ButtonsTabProps {
  customization: EventCustomization;
  onButtonStyleChange: (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => void;
  onToggleButtons?: (checked: boolean) => void;
  onToggleCalendarButton?: (checked: boolean) => void;
}

const ButtonsTab: React.FC<ButtonsTabProps> = ({
  customization,
  onButtonStyleChange,
  onToggleButtons,
  onToggleCalendarButton
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-buttons" className="text-base font-medium">Show Accept/Decline Buttons</Label>
        <Switch 
          id="show-buttons" 
          checked={customization.showAcceptDeclineButtons !== false}
          onCheckedChange={(checked) => onToggleButtons && onToggleButtons(checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-calendar" className="text-base font-medium">Show Add to Calendar Button</Label>
        <Switch 
          id="show-calendar" 
          checked={customization.showAddToCalendarButton !== false}
          onCheckedChange={(checked) => onToggleCalendarButton && onToggleCalendarButton(checked)}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className={customization.showAcceptDeclineButtons === false ? 'opacity-50 pointer-events-none' : ''}>
        <h3 className="font-medium text-base mb-4">Button Styles</h3>
        <ButtonStyleSelector 
          acceptButton={customization.buttons.accept}
          declineButton={customization.buttons.decline}
          onButtonStyleChange={onButtonStyleChange}
        />
      </div>

      <div className="p-4 rounded-md bg-muted/50 mt-4">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="flex justify-center gap-3 mb-4">
          <button 
            className="py-2 px-4 flex items-center gap-1"
            style={{
              backgroundColor: customization.buttons.accept.background,
              color: customization.buttons.accept.color,
              borderRadius: customization.buttons.accept.shape === 'rounded' ? '0.375rem' : 
                             customization.buttons.accept.shape === 'pill' ? '9999px' : '0'
            }}
          >
            Accept
          </button>
          
          <button
            className="py-2 px-4 flex items-center gap-1"
            style={{
              backgroundColor: customization.buttons.decline.background,
              color: customization.buttons.decline.color,
              borderRadius: customization.buttons.decline.shape === 'rounded' ? '0.375rem' : 
                             customization.buttons.decline.shape === 'pill' ? '9999px' : '0'
            }}
          >
            Decline
          </button>
        </div>
        
        {customization.showAddToCalendarButton !== false && (
          <div className="flex justify-center">
            <button className="text-xs py-1 px-2 border rounded">
              Add to Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonsTab;
