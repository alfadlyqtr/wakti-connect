
import React, { createContext, useContext } from "react";
import { EventCustomization } from "@/types/event.types";

interface CustomizationContextType {
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
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{
  children: React.ReactNode;
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}> = ({ children, customization, onCustomizationChange }) => {
  // Handler functions
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

  const value = {
    customization,
    onCustomizationChange,
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
    handleElementAnimationsChange
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
