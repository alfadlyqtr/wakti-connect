
import { BackgroundType, ButtonShape, EventCustomization, ElementAnimations } from "@/types/event.types";

export interface CustomizationContextType {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  
  // Background handling
  handleBackgroundTypeChange: (type: BackgroundType) => void;
  handleBackgroundValueChange: (value: string) => void;
  
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
  handleCardEffectChange: (effect: string) => void;
  handleBorderRadiusChange: (radius: string) => void;
  handleAnimationChange: (animation: string) => void;
  handleElementAnimationsChange: (animations: ElementAnimations) => void;
  
  // Map display
  handleMapDisplayChange: (display: 'button' | 'both' | 'qrcode') => void;

  // Header image
  handleHeaderImageChange: (url: string) => void;
}
