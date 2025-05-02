
import { EventCustomization, MapDisplayType } from "@/types/event.types";

export const createFeatureHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleAddToCalendarChange = (enabled: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: enabled
    });
  };

  const handleChatbotChange = (enabled: boolean) => {
    onCustomizationChange({
      ...customization,
      enableChatbot: enabled
    });
  };

  const handleMapDisplayChange = (display: MapDisplayType) => {
    onCustomizationChange({
      ...customization,
      mapDisplay: display
    });
  };

  return {
    handleAddToCalendarChange,
    handleChatbotChange,
    handleMapDisplayChange
  };
};
