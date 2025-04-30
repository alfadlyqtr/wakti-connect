
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface InteractiveFeaturesProps {
  showButtons: boolean;
  showCalendar: boolean;
  onToggleButtons: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
}

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({
  showButtons,
  showCalendar,
  onToggleButtons,
  onToggleCalendar,
}) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Interactive Features</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-buttons" className="cursor-pointer">Show Action Buttons</Label>
          <Switch 
            id="show-buttons" 
            checked={showButtons}
            onCheckedChange={onToggleButtons}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-calendar" className="cursor-pointer">Show Calendar Preview</Label>
          <Switch 
            id="show-calendar" 
            checked={showCalendar}
            onCheckedChange={onToggleCalendar}
          />
        </div>
      </div>
    </div>
  );
};
