
import { BackgroundType, EventCustomization } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  // Set up defaults for background if not present
  const getBackground = () => {
    return customization.background || { type: 'solid' as BackgroundType, value: '#ffffff' };
  };

  const handleBackgroundTypeChange = (type: BackgroundType) => {
    const background = getBackground();
    onCustomizationChange({
      ...customization,
      background: {
        ...background,
        type,
      }
    });
  };

  const handleBackgroundValueChange = (value: string) => {
    const background = getBackground();
    onCustomizationChange({
      ...customization,
      background: {
        ...background,
        value,
      }
    });
  };

  // Combined handler for use with BackgroundSelector component
  const handleBackgroundChange = (type: 'color' | 'image', value: string) => {
    const mappedType = type === 'color' ? 'solid' as BackgroundType : 'image' as BackgroundType;
    onCustomizationChange({
      ...customization,
      background: {
        type: mappedType,
        value,
      }
    });
  };

  return {
    handleBackgroundTypeChange,
    handleBackgroundValueChange,
    handleBackgroundChange
  };
};
