import { EventCustomization, BackgroundType } from "@/types/event.types";

export const createBackgroundHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleBackgroundChange = (type: 'color' | 'gradient' | 'image', value: string) => {
    // Convert 'color' to 'solid' for internal representation
    const backgroundType: BackgroundType = type === 'color' ? 'solid' : (type as BackgroundType);
    
    let finalValue = value;
    if (type === 'gradient') {
      // Support both new and legacy gradient formats
      finalValue = value.includes('noise') || value.includes('radial-gradient') 
        ? value // Keep advanced gradients as is
        : `linear-gradient(${customization.background.angle || 90}deg, ${value})`; // Legacy format
    }
    
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        type: backgroundType,
        value: finalValue
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
