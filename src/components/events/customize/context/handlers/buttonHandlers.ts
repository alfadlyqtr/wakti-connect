
import { EventCustomization } from "@/types/event.types";

export const createButtonHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleButtonStyleChange = (
    type: 'accept' | 'decline',
    property: 'background' | 'color' | 'shape',
    value: string
  ) => {
    onCustomizationChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [type]: {
          ...customization.buttons[type],
          [property]: value
        }
      }
    });
  };

  return { handleButtonStyleChange };
};
