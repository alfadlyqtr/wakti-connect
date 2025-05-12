
import { EventCustomization } from "@/types/event.types";

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
    onCustomizationChange({
      ...customization,
      utilityButtons: {
        ...(customization.utilityButtons || {}),
        [buttonType]: {
          ...(customization.utilityButtons?.[buttonType] || {}),
          [property]: value
        }
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
