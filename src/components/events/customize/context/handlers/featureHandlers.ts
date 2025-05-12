
import { EventCustomization } from "@/types/event.types";

export const createFeatureHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: checked
    });
  };

  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
    });
  };

  const handleBrandingChange = (property: 'logo' | 'slogan', value: string) => {
    onCustomizationChange({
      ...customization,
      branding: {
        ...(customization.branding || {}),
        [property]: value
      }
    });
  };

  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };

  const handleMapDisplayChange = (value: 'button' | 'both') => {
    onCustomizationChange({
      ...customization,
      mapDisplay: value
    });
  };

  return { 
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleAnimationChange,
    handleMapDisplayChange
  };
};
