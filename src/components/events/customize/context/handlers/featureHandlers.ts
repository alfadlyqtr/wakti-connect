
import { EventCustomization } from "@/types/event.types";

export const createFeatureHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAddToCalendarButton: checked
    });
  };

  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
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
    handleAnimationChange,
    handleMapDisplayChange
  };
};
