
import { EventCustomization, AnimationType, ElementAnimations } from "@/types/event.types";
import { CardEffect } from "../types";

export const createEffectHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleCardEffectChange = (cardEffect: CardEffect) => {
    onCustomizationChange({
      ...customization,
      cardEffect
    });
  };

  const handleBorderRadiusChange = (radius: string) => {
    const cardEffect = customization.cardEffect || { type: 'shadow' };
    onCustomizationChange({
      ...customization,
      cardEffect: {
        ...cardEffect,
        borderRadius: radius as 'none' | 'small' | 'medium' | 'large'
      }
    });
  };

  const handleAnimationChange = (animation: string) => {
    onCustomizationChange({
      ...customization,
      animation: animation as AnimationType
    });
  };

  const handleElementAnimationsChange = (animations: ElementAnimations) => {
    onCustomizationChange({
      ...customization,
      elementAnimations: animations
    });
  };

  return {
    handleCardEffectChange,
    handleBorderRadiusChange,
    handleAnimationChange,
    handleElementAnimationsChange
  };
};
