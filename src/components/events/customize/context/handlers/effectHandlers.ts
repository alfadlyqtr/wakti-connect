
import { EventCustomization, ButtonShape } from "@/types/event.types";

export const createEffectHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleCardEffectChange = (cardEffect: any) => {
    onCustomizationChange({
      ...customization,
      cardEffect: {
        ...(customization.cardEffect || {}),
        ...cardEffect
      }
    });
  };

  const handleElementAnimationsChange = (elementAnimations: any) => {
    onCustomizationChange({
      ...customization,
      elementAnimations: {
        ...(customization.elementAnimations || {}),
        ...elementAnimations
      }
    });
  };

  const handleUtilityButtonStyleChange = (
    buttonType: 'calendar' | 'map' | 'qr',
    property: 'background' | 'color' | 'shape',
    value: string
  ) => {
    // Initialize utilityButtons object if it doesn't exist
    const currentUtilityButtons = customization.utilityButtons || {};
    
    // Initialize button type configuration if it doesn't exist
    const currentButtonConfig = currentUtilityButtons[buttonType] || {
      background: '#ffffff',
      color: '#000000',
      shape: 'rounded' as ButtonShape
    };
    
    // Create updated configuration
    const updatedButtonConfig = {
      ...currentButtonConfig,
      [property]: value
    };

    onCustomizationChange({
      ...customization,
      utilityButtons: {
        ...currentUtilityButtons,
        [buttonType]: updatedButtonConfig
      }
    });
  };

  const handlePoweredByColorChange = (color: string) => {
    onCustomizationChange({
      ...customization,
      poweredByColor: color
    });
  };

  return {
    handleCardEffectChange,
    handleElementAnimationsChange,
    handleUtilityButtonStyleChange,
    handlePoweredByColorChange
  };
};
