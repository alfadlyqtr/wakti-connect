import { useState } from 'react';
import { EventCustomization, GradientDirection } from '@/types/event.types';
import React, { createContext, useContext } from 'react';

// Default customization for new events
export const defaultCustomization: EventCustomization = {
  background: {
    type: "solid",
    value: "#f3f4f6",
    gradient: {
      angle: 135,
      direction: "to-r" as GradientDirection,
      colorStops: [
        { color: "#6366f1", position: 0 },
        { color: "#8b5cf6", position: 100 }
      ],
      isRadial: false
    }
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
    alignment: "center",
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
  locationFont: {
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
      text: "Accept"
    },
    decline: {
      background: "#ef4444",
      color: "#ffffff",
      shape: "rounded",
      text: "Decline",
      isVisible: true
    },
    position: "center",
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
  headerStyle: "simple" as "simple" | "banner" | "minimal" | "custom",
  headerHeight: "120px",
  headerAlignment: "center",
  footerStyle: "simple",
  footerBackground: "#f9fafb",
  footerTextColor: "#6b7280",
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
  shareOptions: {
    whatsapp: true,
    email: true,
    copyLink: true,
    qrCode: true,
  }
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
  setHeaderAlignment: (alignment: "left" | "center" | "right" | "justify") => void;
  
  // Description font handlers
  setDescriptionFontFamily: (family: string) => void;
  setDescriptionFontColor: (color: string) => void;
  setDescriptionFontSize: (size: string) => void;
  setDescriptionFontWeight: (weight: string) => void;
  
  // Button handlers
  setAcceptButtonSettings: (background: string, color: string, shape: "rounded" | "pill" | "square") => void;
  setDeclineButtonSettings: (background: string, color: string, shape: "rounded" | "pill" | "square") => void;
  setButtonVisibility: (buttonType: "accept" | "decline" | "calendar", isVisible: boolean) => void;
  setButtonText: (buttonType: "accept" | "decline", text: string) => void;
  setButtonsPosition: (position: "left" | "center" | "right" | "spaced") => void;
  
  // Header style handler
  setHeaderStyle: (style: "simple" | "banner" | "minimal" | "custom") => void;
  setHeaderImage: (imageUrl: string) => void;
  setHeaderHeight: (height: string) => void;
  
  // Footer style handlers
  setFooterStyle: (style: "simple" | "detailed" | "minimal" | "none") => void;
  setFooterText: (text: string) => void;
  setFooterBackground: (color: string) => void;
  setFooterTextColor: (color: string) => void;
  
  // Feature toggles
  toggleFeature: (feature: string, enabled: boolean) => void;
  
  // Background handler
  setBackground: (type: "solid" | "gradient" | "image", value: string) => void;
  setGradientSettings: (angle: number, direction: GradientDirection, colorStops: any[], isRadial: boolean) => void;
  
  // Branding handlers
  setBrandingLogo: (logo: string) => void;
  setBrandingSlogan: (slogan: string) => void;
  setShowPoweredBy: (show: boolean) => void;
  setPoweredByColor: (color: string) => void;
  
  // Share options
  setShareOption: (option: string, enabled: boolean) => void;
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
  
  // Header alignment handler
  const setHeaderAlignment = (alignment: "left" | "center" | "right" | "justify") => {
    setCustomization(prev => ({
      ...prev,
      headerAlignment: alignment
    }));
  };
  
  // Button visibility handler
  const setButtonVisibility = (buttonType: "accept" | "decline" | "calendar", isVisible: boolean) => {
    if (buttonType === "accept" || buttonType === "decline") {
      setCustomization(prev => ({
        ...prev,
        buttons: {
          ...prev.buttons,
          [buttonType]: {
            ...prev.buttons[buttonType],
            isVisible
          }
        }
      }));
    } else if (buttonType === "calendar") {
      setCustomization(prev => ({
        ...prev,
        showAddToCalendarButton: isVisible
      }));
    }
  };
  
  // Button text handler
  const setButtonText = (buttonType: "accept" | "decline", text: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [buttonType]: {
          ...prev.buttons[buttonType],
          text
        }
      }
    }));
  };
  
  // Buttons position handler
  const setButtonsPosition = (position: "left" | "center" | "right" | "spaced") => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        position
      }
    }));
  };
  
  // Header handlers
  const setHeaderStyle = (style: "simple" | "banner" | "minimal" | "custom") => {
    setCustomization(prev => ({
      ...prev,
      headerStyle: style
    }));
  };
  
  const setHeaderImage = (imageUrl: string) => {
    setCustomization(prev => ({
      ...prev,
      headerImage: imageUrl
    }));
  };
  
  const setHeaderHeight = (height: string) => {
    setCustomization(prev => ({
      ...prev,
      headerHeight: height
    }));
  };
  
  // Footer handlers
  const setFooterStyle = (style: "simple" | "detailed" | "minimal" | "none") => {
    setCustomization(prev => ({
      ...prev,
      footerStyle: style
    }));
  };
  
  const setFooterText = (text: string) => {
    setCustomization(prev => ({
      ...prev,
      footerText: text
    }));
  };
  
  const setFooterBackground = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      footerBackground: color
    }));
  };
  
  const setFooterTextColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      footerTextColor: color
    }));
  };
  
  // Gradient settings handler
  const setGradientSettings = (angle: number, direction: GradientDirection, colorStops: any[], isRadial: boolean) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        ...prev.background,
        gradient: {
          angle,
          direction,
          colorStops,
          isRadial
        }
      }
    }));
  };
  
  // Background handler
  const setBackground = (type: "solid" | "gradient" | "image", value: string) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        ...prev.background,
        type,
        value,
      }
    }));
  };
  
  // Branding handlers
  const setBrandingLogo = (logo: string) => {
    setCustomization(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        logo
      }
    }));
  };
  
  const setBrandingSlogan = (slogan: string) => {
    setCustomization(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        slogan
      }
    }));
  };
  
  const setShowPoweredBy = (show: boolean) => {
    setCustomization(prev => ({
      ...prev,
      showPoweredBy: show
    }));
  };
  
  const setPoweredByColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      poweredByColor: color
    }));
  };
  
  // Share options handler
  const setShareOption = (option: string, enabled: boolean) => {
    setCustomization(prev => ({
      ...prev,
      shareOptions: {
        ...prev.shareOptions,
        [option]: enabled
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
    setHeaderAlignment,
    setDescriptionFontFamily,
    setDescriptionFontColor,
    setDescriptionFontSize,
    setDescriptionFontWeight,
    setAcceptButtonSettings,
    setDeclineButtonSettings,
    setButtonVisibility,
    setButtonText,
    setButtonsPosition,
    setHeaderStyle,
    setHeaderImage,
    setHeaderHeight,
    setFooterStyle,
    setFooterText,
    setFooterBackground,
    setFooterTextColor,
    toggleFeature,
    setBackground,
    setGradientSettings,
    setBrandingLogo,
    setBrandingSlogan,
    setShowPoweredBy,
    setPoweredByColor,
    setShareOption
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
