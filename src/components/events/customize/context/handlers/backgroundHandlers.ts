
import { EventCustomization, BackgroundType } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleBackgroundChange = (type: 'color' | 'image', value: string) => {
    // Convert 'color' to 'solid' for internal representation
    const backgroundType: BackgroundType = type === 'color' ? 'solid' : (type as BackgroundType);
    
    let finalValue = value;
    
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        type: backgroundType,
        value: finalValue
      }
    });
  };

  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };

  return {
    handleBackgroundChange,
    handleAnimationChange
  };
};
