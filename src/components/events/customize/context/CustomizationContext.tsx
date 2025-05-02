
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
    // Background handling
    handleBackgroundTypeChange: handlers.handleBackgroundTypeChange,
    handleBackgroundValueChange: handlers.handleBackgroundValueChange,
    handleBackgroundChange: handlers.handleBackgroundChange,
    // Font handling
    handleFontFamilyChange: handlers.handleFontFamilyChange,
    handleFontColorChange: handlers.handleFontColorChange,
    handleFontSizeChange: handlers.handleFontSizeChange,
    handleTextAlignmentChange: handlers.handleTextAlignmentChange,
    handleHeaderStyleChange: handlers.handleHeaderStyleChange,
    handleTextShadowChange: handlers.handleTextShadowChange,
    // Button handling
    handleAcceptButtonChange: handlers.handleAcceptButtonChange,
    handleDeclineButtonChange: handlers.handleDeclineButtonChange,
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
