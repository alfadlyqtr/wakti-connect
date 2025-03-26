
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
  onToggleChatbot: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
  onToggleButtons: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onMapDisplayChange: (value: 'button' | 'qrcode' | 'both') => void;
  onUtilityButtonStyleChange?: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
  onPoweredByColorChange?: (color: string) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleChatbot,
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
        enableChatbot={customization.enableChatbot || false}
        onToggleButtons={onToggleButtons}
        onToggleCalendar={onToggleCalendar}
        onToggleChatbot={onToggleChatbot}
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
