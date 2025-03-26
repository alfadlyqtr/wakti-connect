
import { EventCustomization } from "@/types/event.types";

export const createCustomizationHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  // Background handlers
  const handleBackgroundChange = (type: 'color' | 'gradient' | 'image', value: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        type,
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
        direction: direction as 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-bottom-right' | 'to-bottom-left' | 'to-top-right' | 'to-top-left'
      }
    });
  };
  
  // Button handlers
  const handleButtonStyleChange = (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => {
    onCustomizationChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [type]: {
          ...customization.buttons[type],
          [property]: value
        }
      }
    });
  };
  
  // Utility button handlers (Calendar, Map, QR Code)
  const handleUtilityButtonStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    onCustomizationChange({
      ...customization,
      utilityButtons: {
        ...customization.utilityButtons || {},
        [buttonType]: {
          ...(customization.utilityButtons?.[buttonType] || {}),
          [property]: value
        }
      }
    });
  };
  
  // Font handlers
  const handleFontChange = (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleHeaderFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      headerFont: {
        ...customization.headerFont || {},
        [property]: value
      }
    });
  };
  
  const handleDescriptionFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...customization.descriptionFont || {},
        [property]: value
      }
    });
  };
  
  const handleDateTimeFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...customization.dateTimeFont || {},
        [property]: value
      }
    });
  };
  
  // Header handlers
  const handleHeaderStyleChange = (style: 'banner' | 'simple' | 'minimal') => {
    onCustomizationChange({
      ...customization,
      headerStyle: style
    });
  };
  
  const handleHeaderImageChange = (imageUrl: string) => {
    onCustomizationChange({
      ...customization,
      headerImage: imageUrl
    });
  };
  
  // Toggle handlers
  const handleToggleChatbot = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableChatbot: checked
    });
  };
  
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAddToCalendarButton: checked
    });
  };
  
  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
    });
  };
  
  // Branding and effect handlers
  const handleBrandingChange = (property: 'logo' | 'slogan', value: string) => {
    onCustomizationChange({
      ...customization,
      branding: {
        ...customization.branding || {},
        [property]: value
      }
    });
  };
  
  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };
  
  const handleMapDisplayChange = (value: 'button' | 'qrcode' | 'both') => {
    onCustomizationChange({
      ...customization,
      mapDisplay: value
    });
  };

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
    handleBackgroundChange,
    handleBackgroundAngleChange,
    handleBackgroundDirectionChange,
    handleButtonStyleChange,
    handleUtilityButtonStyleChange,  // Added new handler
    handleFontChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange,
    handleHeaderStyleChange,
    handleHeaderImageChange,
    handleToggleChatbot,
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleAnimationChange,
    handleMapDisplayChange,
    handleCardEffectChange,
    handleElementAnimationsChange
  };
};
