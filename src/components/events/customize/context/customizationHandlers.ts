
import { EventCustomization } from "@/types/event.types";
import { produce } from "immer";

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
        direction: direction as any
      }
    });
  };

  // Button style handlers
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

  // Utility button style handler
  const handleUtilityButtonStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    const updatedCustomization = produce(customization, draft => {
      // Initialize utilityButtons if it doesn't exist
      if (!draft.utilityButtons) {
        draft.utilityButtons = {};
      }
      
      // Initialize the specific button type if it doesn't exist
      if (!draft.utilityButtons[buttonType]) {
        draft.utilityButtons[buttonType] = {
          background: '#ffffff',
          color: '#000000',
          shape: 'rounded'
        };
      }
      
      // Update the property
      draft.utilityButtons[buttonType][property] = value;
    });
    
    onCustomizationChange(updatedCustomization);
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
        ...customization.headerFont,
        [property]: value
      }
    });
  };

  const handleDescriptionFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...customization.descriptionFont,
        [property]: value
      }
    });
  };

  const handleDateTimeFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...customization.dateTimeFont,
        [property]: value
      }
    });
  };

  // Header style handlers
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

  // Feature toggle handlers
  const handleToggleChatbot = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableChatbot: checked
    });
  };

  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: checked,
      showAddToCalendarButton: checked
    });
  };

  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
    });
  };

  // Branding handlers
  const handleBrandingChange = (property: 'logo' | 'slogan', value: string) => {
    const updatedBranding = {
      ...customization.branding,
      [property]: value
    };
    
    onCustomizationChange({
      ...customization,
      branding: updatedBranding
    });
  };

  // Animation handlers
  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };

  // Map display handlers
  const handleMapDisplayChange = (value: 'button' | 'qrcode' | 'both') => {
    onCustomizationChange({
      ...customization,
      mapDisplay: value
    });
  };

  // Card effect handlers
  const handleCardEffectChange = (cardEffect: any) => {
    onCustomizationChange({
      ...customization,
      cardEffect
    });
  };

  // Element animations handlers
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
    handleElementAnimationsChange,
    handleUtilityButtonStyleChange
  };
};
