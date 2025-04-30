
import { useState } from "react";
import { 
  EventCustomization, 
  BackgroundType, 
  ButtonShape, 
  TextAlign, 
  FontWeight,
  CardEffectType,
  GradientDirection,
  GradientColorStop
} from "@/types/event.types";

// Default customization settings
const defaultCustomization: EventCustomization = {
  background: {
    type: "solid",
    value: "#ffffff"
  },
  font: {
    family: "system-ui, sans-serif",
    size: "medium",
    color: "#333333",
    weight: "normal",
    alignment: "left"
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
    position: "center"
  },
  cardEffect: {
    type: "shadow",
    borderRadius: "medium",
    border: false,
    borderColor: "#e5e7eb"
  },
  showAcceptDeclineButtons: true,
  showAddToCalendarButton: true,
  headerStyle: 'simple',
  footerStyle: 'simple',
  poweredByColor: '#6b7280',
  mapDisplay: 'button',
  shareOptions: {
    whatsapp: true,
    email: true,
    sms: false,
    copyLink: true,
    qrCode: false
  }
};

export const useEventCustomization = () => {
  const [customization, setCustomization] = useState<EventCustomization>(defaultCustomization);

  // Background customization functions
  const setBackgroundType = (type: BackgroundType) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        ...prev.background,
        type
      }
    }));
  };

  const setBackgroundValue = (value: string) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        ...prev.background,
        value
      }
    }));
  };

  const setGradientBackground = (gradient: string, angle?: number, direction?: GradientDirection, colorStops?: GradientColorStop[], isRadial?: boolean) => {
    setCustomization(prev => ({
      ...prev,
      background: {
        type: "gradient",
        value: gradient,
        gradient: {
          angle,
          direction,
          colorStops,
          isRadial
        }
      }
    }));
  };

  // Font customization functions
  const setFontFamily = (family: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        family
      }
    }));
  };

  const setFontSize = (size: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        size
      }
    }));
  };

  const setFontColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        color
      }
    }));
  };

  const setFontWeight = (weight: FontWeight) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        weight
      }
    }));
  };

  const setFontAlignment = (alignment: TextAlign) => {
    setCustomization(prev => ({
      ...prev,
      font: {
        ...prev.font,
        alignment
      }
    }));
  };

  const setFont = (property: string, value: string) => {
    setCustomization(prev => {
      const updatedFont = { ...prev.font };
      
      switch(property) {
        case 'family':
          updatedFont.family = value;
          break;
        case 'size':
          updatedFont.size = value;
          break;
        case 'color':
          updatedFont.color = value;
          break;
        case 'weight':
          // Ensure the value is cast to the FontWeight type
          if (value === 'normal' || value === 'medium' || value === 'bold' || value === 'light') {
            updatedFont.weight = value as FontWeight;
          }
          break;
        case 'alignment':
          if (value === 'left' || value === 'center' || value === 'right' || value === 'justify') {
            updatedFont.alignment = value as TextAlign;
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        font: updatedFont
      };
    });
  };

  // Header font customization
  const setHeaderFont = (property: string, value: string) => {
    setCustomization(prev => {
      // Initialize headerFont if it doesn't exist
      const headerFont = prev.headerFont || {
        family: prev.font.family,
        size: prev.font.size,
        color: prev.font.color,
        weight: prev.font.weight,
        alignment: prev.font.alignment
      };

      const updatedHeaderFont = { ...headerFont };
      
      switch(property) {
        case 'family':
          updatedHeaderFont.family = value;
          break;
        case 'size':
          updatedHeaderFont.size = value;
          break;
        case 'color':
          updatedHeaderFont.color = value;
          break;
        case 'weight':
          // Ensure the value is cast to the FontWeight type
          if (value === 'normal' || value === 'medium' || value === 'bold' || value === 'light') {
            updatedHeaderFont.weight = value as FontWeight;
          }
          break;
        case 'alignment':
          if (value === 'left' || value === 'center' || value === 'right' || value === 'justify') {
            updatedHeaderFont.alignment = value as TextAlign;
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        headerFont: updatedHeaderFont
      };
    });
  };

  // Description font customization
  const setDescriptionFont = (property: string, value: string) => {
    setCustomization(prev => {
      // Initialize descriptionFont if it doesn't exist
      const descriptionFont = prev.descriptionFont || {
        family: prev.font.family,
        size: prev.font.size,
        color: prev.font.color,
        weight: prev.font.weight,
        alignment: prev.font.alignment
      };

      const updatedDescriptionFont = { ...descriptionFont };
      
      switch(property) {
        case 'family':
          updatedDescriptionFont.family = value;
          break;
        case 'size':
          updatedDescriptionFont.size = value;
          break;
        case 'color':
          updatedDescriptionFont.color = value;
          break;
        case 'weight':
          // Ensure the value is cast to the FontWeight type
          if (value === 'normal' || value === 'medium' || value === 'bold' || value === 'light') {
            updatedDescriptionFont.weight = value as FontWeight;
          }
          break;
        case 'alignment':
          if (value === 'left' || value === 'center' || value === 'right' || value === 'justify') {
            updatedDescriptionFont.alignment = value as TextAlign;
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        descriptionFont: updatedDescriptionFont
      };
    });
  };

  // DateTime font customization
  const setDateTimeFont = (property: string, value: string) => {
    setCustomization(prev => {
      // Initialize dateTimeFont if it doesn't exist
      const dateTimeFont = prev.dateTimeFont || {
        family: prev.font.family,
        size: prev.font.size,
        color: prev.font.color,
        weight: prev.font.weight,
        alignment: prev.font.alignment
      };

      const updatedDateTimeFont = { ...dateTimeFont };
      
      switch(property) {
        case 'family':
          updatedDateTimeFont.family = value;
          break;
        case 'size':
          updatedDateTimeFont.size = value;
          break;
        case 'color':
          updatedDateTimeFont.color = value;
          break;
        case 'weight':
          // Ensure the value is cast to the FontWeight type
          if (value === 'normal' || value === 'medium' || value === 'bold' || value === 'light') {
            updatedDateTimeFont.weight = value as FontWeight;
          }
          break;
        case 'alignment':
          if (value === 'left' || value === 'center' || value === 'right' || value === 'justify') {
            updatedDateTimeFont.alignment = value as TextAlign;
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        dateTimeFont: updatedDateTimeFont
      };
    });
  };

  // Button customization functions
  const setAcceptButtonBackground = (background: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        accept: {
          ...prev.buttons.accept,
          background
        }
      }
    }));
  };

  const setAcceptButtonColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        accept: {
          ...prev.buttons.accept,
          color
        }
      }
    }));
  };

  const setAcceptButtonShape = (shape: ButtonShape) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        accept: {
          ...prev.buttons.accept,
          shape
        }
      }
    }));
  };

  const setAcceptButtonText = (text: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        accept: {
          ...prev.buttons.accept,
          text
        }
      }
    }));
  };

  const setDeclineButtonBackground = (background: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          background
        }
      }
    }));
  };

  const setDeclineButtonColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          color
        }
      }
    }));
  };

  const setDeclineButtonShape = (shape: ButtonShape) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          shape
        }
      }
    }));
  };

  const setDeclineButtonText = (text: string) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          text
        }
      }
    }));
  };

  const setDeclineButtonVisibility = (isVisible: boolean) => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        decline: {
          ...prev.buttons.decline,
          isVisible
        }
      }
    }));
  };

  const setButtonPosition = (position: "left" | "center" | "right" | "spaced") => {
    setCustomization(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        position
      }
    }));
  };

  // Card effect customization
  const setCardEffect = (type: CardEffectType) => {
    setCustomization(prev => ({
      ...prev,
      cardEffect: {
        ...prev.cardEffect,
        type
      }
    }));
  };

  const setCardBorderRadius = (borderRadius: "none" | "small" | "medium" | "large") => {
    setCustomization(prev => ({
      ...prev,
      cardEffect: {
        ...prev.cardEffect,
        borderRadius
      }
    }));
  };

  const setCardBorder = (border: boolean) => {
    setCustomization(prev => ({
      ...prev,
      cardEffect: {
        ...prev.cardEffect,
        border
      }
    }));
  };

  const setCardBorderColor = (borderColor: string) => {
    setCustomization(prev => ({
      ...prev,
      cardEffect: {
        ...prev.cardEffect,
        borderColor
      }
    }));
  };

  // Feature toggles
  const toggleShowAcceptDeclineButtons = (value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      showAcceptDeclineButtons: value
    }));
  };

  const toggleShowAddToCalendarButton = (value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      showAddToCalendarButton: value
    }));
  };

  // Header/Footer customization
  const setHeaderStyle = (style: 'banner' | 'simple' | 'minimal' | 'custom') => {
    setCustomization(prev => ({
      ...prev,
      headerStyle: style
    }));
  };

  const setHeaderImage = (image: string) => {
    setCustomization(prev => ({
      ...prev,
      headerImage: image
    }));
  };

  const setHeaderHeight = (height: string) => {
    setCustomization(prev => ({
      ...prev,
      headerHeight: height
    }));
  };

  const setHeaderAlignment = (alignment: TextAlign) => {
    setCustomization(prev => ({
      ...prev,
      headerAlignment: alignment
    }));
  };

  const setFooterStyle = (style: 'simple' | 'detailed' | 'minimal' | 'none') => {
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

  // Branding functions
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

  // Powered By settings
  const setShowPoweredBy = (value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      showPoweredBy: value
    }));
  };

  const setPoweredByColor = (color: string) => {
    setCustomization(prev => ({
      ...prev,
      poweredByColor: color
    }));
  };

  // Share options
  const toggleShareOption = (option: keyof EventCustomization['shareOptions'], value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      shareOptions: {
        ...prev.shareOptions,
        [option]: value
      }
    }));
  };

  return {
    customization,
    setCustomization,
    // Background
    setBackgroundType,
    setBackgroundValue,
    setGradientBackground,
    // Font
    setFontFamily,
    setFontSize,
    setFontColor,
    setFontWeight,
    setFontAlignment,
    setFont,
    // Specific fonts
    setHeaderFont,
    setDescriptionFont,
    setDateTimeFont,
    // Buttons
    setAcceptButtonBackground,
    setAcceptButtonColor,
    setAcceptButtonShape,
    setAcceptButtonText,
    setDeclineButtonBackground,
    setDeclineButtonColor,
    setDeclineButtonShape,
    setDeclineButtonText,
    setDeclineButtonVisibility,
    setButtonPosition,
    // Card effects
    setCardEffect,
    setCardBorderRadius,
    setCardBorder,
    setCardBorderColor,
    // Feature toggles
    toggleShowAcceptDeclineButtons,
    toggleShowAddToCalendarButton,
    // Header/Footer
    setHeaderStyle,
    setHeaderImage,
    setHeaderHeight,
    setHeaderAlignment,
    setFooterStyle,
    setFooterText,
    setFooterBackground,
    setFooterTextColor,
    // Branding
    setBrandingLogo,
    setBrandingSlogan,
    // Powered By
    setShowPoweredBy,
    setPoweredByColor,
    // Share options
    toggleShareOption
  };
};
