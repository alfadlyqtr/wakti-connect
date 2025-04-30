
import { useState } from 'react';
import { EventCustomization } from '@/types/event.types';
import React, { createContext, useContext } from 'react';

// Default customization for new events
export const defaultCustomization: EventCustomization = {
  background: {
    type: "solid",
    value: "#f3f4f6",
  },
  font: {
    family: "Inter",
    size: "1rem",
    color: "#374151",
    weight: "normal",
    alignment: "left",
  },
  headerFont: {
    family: "Inter",
    size: "1.5rem",
    color: "#111827",
    weight: "medium",
  },
  descriptionFont: {
    family: "Inter", 
    size: "0.875rem",
    color: "#6b7280",
    weight: "normal",
  },
  dateTimeFont: {
    family: "Inter",
    size: "1rem",
    color: "#374151",
    weight: "normal",
  },
  buttons: {
    accept: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
    decline: {
      background: "#ef4444",
      color: "#ffffff",
      shape: "rounded",
    },
  },
  utilityButtons: {
    calendar: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
    map: {
      background: "#4f46e5",
      color: "#ffffff",
      shape: "rounded",
    },
  },
  headerStyle: "simple" as "simple" | "banner" | "minimal",
  showAcceptDeclineButtons: true,
  showAddToCalendarButton: true,
  enableAddToCalendar: true,
  cardEffect: {
    type: "shadow",
    borderRadius: "medium",
    border: false,
    borderColor: "#e5e7eb",
  },
  animation: "fade",
  elementAnimations: {
    text: "fade",
    buttons: "fade",
    icons: "fade",
    delay: "none",
  },
  mapDisplay: "button",
  poweredByColor: "#6b7280",
};

// Define the context interface
interface EventCustomizationContextProps {
  customization: EventCustomization;
  setCustomization: React.Dispatch<React.SetStateAction<EventCustomization>>;
  updateCustomization: (updates: Partial<EventCustomization>) => void;
  
  // Font handlers
  setFontFamily: (family: string) => void;
  setFontColor: (color: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontAlignment: (alignment: "left" | "center" | "right" | "justify") => void;
  
  // Header font handlers
  setHeaderFontFamily: (family: string) => void;
  setHeaderFontColor: (color: string) => void;
  setHeaderFontSize: (size: string) => void;
  setHeaderFontWeight: (weight: string) => void;
  
  // Description font handlers
  setDescriptionFontFamily: (family: string) => void;
  setDescriptionFontColor: (color: string) => void;
  setDescriptionFontSize: (size: string) => void;
  setDescriptionFontWeight: (weight: string) => void;
  
  // Button handlers
  setAcceptButtonSettings: (background: string, color: string, shape: "rounded" | "pill" | "square") => void;
  setDeclineButtonSettings: (background: string, color: string, shape: "rounded" | "pill" | "square") => void;
  
  // Header style handler
  setHeaderStyle: (style: "simple" | "banner" | "minimal") => void;
  
  // Feature toggles
  toggleFeature: (feature: string, enabled: boolean) => void;
  
  // Background handler
  setBackground: (type: "solid" | "image", value: string) => void;
}

// Create the context
const EventCustomizationContext = createContext<EventCustomizationContextProps | undefined>(undefined);

// Create the provider component
export const EventCustomizationProvider: React.FC<{
  children: React.ReactNode;
  initialCustomization?: EventCustomization;
}> = ({ children, initialCustomization }) => {
  const [customization, setCustomization] = useState<EventCustomization>(
    initialCustomization || defaultCustomization
  );
  
  const updateCustomization = (updates: Partial<EventCustomization>) => {
    setCustomization(prev => ({
      ...prev,
      ...updates,
    }));
  };
  
  // Font handlers
  const setFontFamily = (family: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        family,
      }
    }));
  };
  
  const setFontColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        color,
      }
    }));
  };
  
  const setFontSize = (size: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        size,
      }
    }));
  };
  
  const setFontWeight = (weight: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        weight,
      }
    }));
  };
  
  const setFontAlignment = (alignment: "left" | "center" | "right" | "justify") => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        alignment,
      }
    }));
  };
  
  // Header font handlers
  const setHeaderFontFamily = (family: string) => {
    setCustomization(prev => ({
      ...prev,
      headerFont: {
        ...prev.headerFont || { ...prev.font, size: "1.5rem", weight: "medium" },
        family,
      }
    }));
  };
  
  const setHeaderFontColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      headerFont: {
        ...prev.headerFont || { ...prev.font, size: "1.5rem", weight: "medium" },
        color,
      }
    }));
  };
  
  const setHeaderFontSize = (size: string) => {
    setCustomization(prev => ({
      ...prev,
      headerFont: {
        ...prev.headerFont || { ...prev.font, size: "1.5rem", weight: "medium" },
        size,
      }
    }));
  };
  
  const setHeaderFontWeight = (weight: string) => {
    setCustomization(prev => ({
      ...prev,
      headerFont: {
        ...prev.headerFont || { ...prev.font, size: "1.5rem", weight: "medium" },
        weight,
      }
    }));
  };
  
  // Description font handlers
  const setDescriptionFontFamily = (family: string) => {
    setCustomization(prev => ({
      ...prev,
      descriptionFont: {
        ...prev.descriptionFont || { ...prev.font, size: "0.875rem" },
        family,
      }
    }));
  };
  
  const setDescriptionFontColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      descriptionFont: {
        ...prev.descriptionFont || { ...prev.font, size: "0.875rem" },
        color,
      }
    }));
  };
  
  const setDescriptionFontSize = (size: string) => {
    setCustomization(prev => ({
      ...prev,
      descriptionFont: {
        ...prev.descriptionFont || { ...prev.font, size: "0.875rem" },
        size,
      }
    }));
  };
  
  const setDescriptionFontWeight = (weight: string) => {
    setCustomization(prev => ({
      ...prev,
      descriptionFont: {
        ...prev.descriptionFont || { ...prev.font, size: "0.875rem" },
        weight,
      }
    }));
  };
  
  // Button handlers
  const setAcceptButtonSettings = (background: string, color: string, shape: "rounded" | "pill" | "square") => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        accept: {
          ...prev.buttons.accept,
          background,
          color,
          shape,
        }
      }
    }));
  };
  
  const setDeclineButtonSettings = (background: string, color: string, shape: "rounded" | "pill" | "square") => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          background,
          color,
          shape,
        }
      }
    }));
  };
  
  // Header style handler
  const setHeaderStyle = (style: "simple" | "banner" | "minimal") => {
    setCustomization(prev => ({
      ...prev,
      headerStyle: style,
    }));
  };
  
  // Feature toggles
  const toggleFeature = (feature: string, enabled: boolean) => {
    setCustomization(prev => ({
      ...prev,
      [feature]: enabled,
    }));
  };
  
  // Background handler
  const setBackground = (type: "solid" | "image", value: string) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        type,
        value,
      }
    }));
  };

  const contextValue: EventCustomizationContextProps = {
    customization,
    setCustomization,
    updateCustomization,
    setFontFamily,
    setFontColor,
    setFontSize,
    setFontWeight,
    setFontAlignment,
    setHeaderFontFamily,
    setHeaderFontColor,
    setHeaderFontSize,
    setHeaderFontWeight,
    setDescriptionFontFamily,
    setDescriptionFontColor,
    setDescriptionFontSize,
    setDescriptionFontWeight,
    setAcceptButtonSettings,
    setDeclineButtonSettings,
    setHeaderStyle,
    toggleFeature,
    setBackground,
  };

  return (
    <EventCustomizationContext.Provider value={contextValue}>
      {children}
    </EventCustomizationContext.Provider>
  );
};

// Create a hook to use the context
export const useEventCustomization = () => {
  const context = useContext(EventCustomizationContext);
  if (context === undefined) {
    throw new Error('useEventCustomization must be used within an EventCustomizationProvider');
  }
  return context;
};

// Basic hook without context for simpler use cases
export const useEventCustomizationState = (initialCustomization?: EventCustomization) => {
  const [customization, setCustomization] = useState<EventCustomization>(
    initialCustomization || defaultCustomization
  );

  const updateCustomization = (updates: Partial<EventCustomization>) => {
    setCustomization(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return {
    customization,
    setCustomization,
    updateCustomization,
  };
};
