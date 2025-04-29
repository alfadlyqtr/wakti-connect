
import { EventCustomization } from "@/types/event.types";

export const createFeatureHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: checked,
      showAddToCalendarButton: checked
    });
  };

  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
    });
  };

  const handleBrandingChange = (property: 'logo' | 'slogan', value: string) => {
    const updatedBranding = {
      ...customization.branding,
      [property]: value
    };
    
    onCustomizationChange({
      ...customization,
      branding: updatedBranding
    });
  };

  const handleMapDisplayChange = (value: 'button' | 'both' | 'qrcode') => {
    onCustomizationChange({
      ...customization,
      mapDisplay: value
    });
  };
  
  const handlePoweredByColorChange = (color: string) => {
    onCustomizationChange({
      ...customization,
      poweredByColor: color
    });
  };

  return {
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleMapDisplayChange,
    handlePoweredByColorChange
  };
};
