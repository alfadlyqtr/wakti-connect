
import { EventCustomization } from "@/types/event.types";

export interface CustomizationContextType {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  handleBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
  handleBackgroundAngleChange: (angle: number) => void;
  handleBackgroundDirectionChange: (direction: string) => void;
  handleButtonStyleChange: (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => void;
  handleFontChange: (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => void;
  handleHeaderFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  handleDescriptionFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  handleDateTimeFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  handleHeaderStyleChange: (style: 'banner' | 'simple' | 'minimal') => void;
  handleHeaderImageChange: (imageUrl: string) => void;
  handleToggleChatbot: (checked: boolean) => void;
  handleToggleCalendar: (checked: boolean) => void;
  handleToggleButtons: (checked: boolean) => void;
  handleBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  handleAnimationChange: (value: 'fade' | 'slide' | 'pop') => void;
  handleMapDisplayChange: (value: 'button' | 'qrcode' | 'both') => void;
  handleCardEffectChange: (cardEffect: any) => void;
  handleElementAnimationsChange: (elementAnimations: any) => void;
  handleUtilityButtonStyleChange: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
}
