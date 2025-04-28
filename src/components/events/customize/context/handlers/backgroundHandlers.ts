
import { EventCustomization, BackgroundType } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  // Updated to handle the UI type 'color' to internal type 'solid' conversion
  // Also handles advanced gradient types (with noise, radial)
  const handleBackgroundChange = (type: 'color' | 'gradient' | 'image', value: string) => {
    // Convert 'color' to 'solid' for internal representation
    const backgroundType: BackgroundType = type === 'color' ? 'solid' : (type as BackgroundType);
    
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        type: backgroundType,
        value
      }
    });
  };

  const handleBackgroundAngleChange = (angle: number) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        angle
      }
    });
  };

  const handleBackgroundDirectionChange = (direction: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        direction
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
    handleBackgroundAngleChange,
    handleBackgroundDirectionChange,
    handleAnimationChange
  };
};
