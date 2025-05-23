
import React from "react";
import { EventCustomization } from "@/types/event.types";
import { Separator } from "@/components/ui/separator";
import { 
  InteractiveFeatures,
  UtilityButtonsStyle,
  BusinessBranding,
  MapDisplayOptions
} from "./features";

interface FeaturesTabProps {
  customization: EventCustomization;
  onToggleCalendar: (checked: boolean) => void;
  onToggleButtons: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onMapDisplayChange: (value: 'button' | 'both' | 'qrcode') => void;
  onUtilityButtonStyleChange?: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
  onPoweredByColorChange?: (color: string) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleCalendar,
  onToggleButtons,
  onBrandingChange,
  onMapDisplayChange,
  onUtilityButtonStyleChange,
  onPoweredByColorChange
}) => {
  return (
    <div className="space-y-6">
      <InteractiveFeatures 
        showButtons={customization.showAcceptDeclineButtons !== false}
        showCalendar={customization.showAddToCalendarButton !== false}
        onToggleButtons={onToggleButtons}
        onToggleCalendar={onToggleCalendar}
      />

      <Separator />
      
      <UtilityButtonsStyle 
        customization={customization}
        onUtilityButtonStyleChange={onUtilityButtonStyleChange}
      />

      <Separator />
      
      <BusinessBranding 
        customization={customization}
        onBrandingChange={onBrandingChange}
        onPoweredByColorChange={onPoweredByColorChange}
      />
      
      <Separator />
      
      <MapDisplayOptions 
        mapDisplay={customization.mapDisplay || 'button'}
        onMapDisplayChange={onMapDisplayChange}
      />
    </div>
  );
};

export default FeaturesTab;
