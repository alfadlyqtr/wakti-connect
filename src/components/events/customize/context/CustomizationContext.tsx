
import React, { createContext, useContext } from "react";
import { EventCustomization } from "@/types/event.types";
import { CustomizationContextType } from "./types";
import { createCustomizationHandlers } from "./customizationHandlers";

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{
  children: React.ReactNode;
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}> = ({ children, customization, onCustomizationChange }) => {
  // Get all handlers from our utility function
  const handlers = createCustomizationHandlers(customization, onCustomizationChange);

  // Create a complete context value with all required properties
  const value: CustomizationContextType = {
    customization,
    onCustomizationChange,
    
    // Add handlers with proper types
    handleBackgroundTypeChange: handlers.handleBackgroundTypeChange,
    handleBackgroundValueChange: handlers.handleBackgroundValueChange,
    handleBackgroundChange: handlers.handleBackgroundChange,
    
    // Font handling
    handleFontFamilyChange: handlers.handleFontFamilyChange || ((family: string) => {
      handlers.handleFontChange?.('family', family);
    }),
    handleFontColorChange: handlers.handleFontColorChange || ((color: string) => {
      handlers.handleFontChange?.('color', color);
    }),
    handleFontSizeChange: handlers.handleFontSizeChange || ((size: string) => {
      handlers.handleFontChange?.('size', size);
    }),
    handleTextAlignmentChange: handlers.handleTextAlignmentChange || ((alignment: string) => {
      handlers.handleFontChange?.('alignment', alignment);
    }),
    handleHeaderStyleChange: handlers.handleHeaderStyleChange,
    handleTextShadowChange: handlers.handleTextShadowChange || ((enabled: boolean) => {
      onCustomizationChange({
        ...customization,
        textShadow: enabled
      });
    }),
    
    // Button handling
    handleAcceptButtonChange: handlers.handleAcceptButtonChange || ((property: string, value: string) => {
      handlers.handleButtonStyleChange?.('accept', property, value);
    }),
    handleDeclineButtonChange: handlers.handleDeclineButtonChange || ((property: string, value: string) => {
      handlers.handleButtonStyleChange?.('decline', property, value);
    }),
    handleButtonShapeChange: handlers.handleButtonShapeChange,
    handleShowButtonsChange: handlers.handleShowButtonsChange,
    
    // Feature toggles
    handleAddToCalendarChange: handlers.handleAddToCalendarChange,
    handleChatbotChange: handlers.handleChatbotChange,
    
    // Effects
    handleCardEffectChange: handlers.handleCardEffectChange,
    handleBorderRadiusChange: handlers.handleBorderRadiusChange,
    handleAnimationChange: handlers.handleAnimationChange,
    handleElementAnimationsChange: handlers.handleElementAnimationsChange,
    
    // Map display
    handleMapDisplayChange: handlers.handleMapDisplayChange,
    
    // Header image
    handleHeaderImageChange: handlers.handleHeaderImageChange,
    
    // Additional handlers needed for components
    ...handlers
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
