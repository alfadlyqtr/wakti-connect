
import { BackgroundType, ButtonShape, EventCustomization, ElementAnimations, CardEffectType, MapDisplayType } from "@/types/event.types";

export interface CustomizationContextType {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  
  // Background handling
  handleBackgroundTypeChange: (type: BackgroundType) => void;
  handleBackgroundValueChange: (value: string) => void;
  handleBackgroundChange: (type: 'color' | 'image', value: string) => void;
  
  // Font handling
  handleFontFamilyChange: (fontFamily: string) => void;
  handleFontColorChange: (color: string) => void;
  handleFontSizeChange: (size: string) => void;
  handleTextAlignmentChange: (alignment: string) => void;
  handleHeaderStyleChange: (style: string) => void;
  handleTextShadowChange: (enabled: boolean) => void;
  
  // Button handling
  handleAcceptButtonChange: (property: string, value: string) => void;
  handleDeclineButtonChange: (property: string, value: string) => void;
  handleButtonShapeChange: (shape: ButtonShape) => void;
  handleShowButtonsChange: (show: boolean) => void;
  
  // Feature toggles
  handleAddToCalendarChange: (enabled: boolean) => void;
  handleChatbotChange: (enabled: boolean) => void;
  
  // Effects
  handleCardEffectChange: (cardEffect: CardEffect) => void;
  handleBorderRadiusChange: (radius: string) => void;
  handleAnimationChange: (animation: string) => void;
  handleElementAnimationsChange: (animations: ElementAnimations) => void;
  
  // Map display
  handleMapDisplayChange: (display: MapDisplayType) => void;

  // Header image
  handleHeaderImageChange: (url: string) => void;
  
  // Optional additional handlers for components
  handleButtonStyleChange?: (buttonType: string, property: string, value: string) => void;
  handleToggleButtons?: (enabled: boolean) => void;
  handleToggleCalendar?: (enabled: boolean) => void;
  handleFontChange?: (fontProperty: string, value: string) => void;
}

// Interface for CardEffect to match the type in event.types.ts
export interface CardEffect {
  type: CardEffectType;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
}
