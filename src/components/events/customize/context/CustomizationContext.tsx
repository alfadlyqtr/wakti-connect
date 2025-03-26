
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

  const value = {
    customization,
    onCustomizationChange,
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
