
import { EventCustomization } from "@/types/event.types";

export const createEffectHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleCardEffectChange = (cardEffect: any) => {
    onCustomizationChange({
      ...customization,
      cardEffect
    });
  };

  const handleElementAnimationsChange = (elementAnimations: any) => {
    onCustomizationChange({
      ...customization,
      elementAnimations
    });
  };

  return {
    handleCardEffectChange,
    handleElementAnimationsChange
  };
};
