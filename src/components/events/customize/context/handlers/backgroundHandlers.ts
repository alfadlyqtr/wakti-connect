
import { EventCustomization, BackgroundType } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleBackgroundChange = (type: BackgroundType | 'color', value: string) => {
    // Convert 'color' to 'solid' for backwards compatibility
    const backgroundType = type === 'color' ? 'solid' as BackgroundType : type as BackgroundType;
    
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
