
import { EventCustomization } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleBackgroundChange = (type: 'color' | 'image', value: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        type,
        value
      }
    });
  };

  return { handleBackgroundChange };
};
