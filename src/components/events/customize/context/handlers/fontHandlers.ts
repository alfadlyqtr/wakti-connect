
import { EventCustomization } from "@/types/event.types";

export const createFontHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleFontChange = (
    property: 'family' | 'size' | 'color' | 'weight' | 'alignment', 
    value: string
  ) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };

  const handleHeaderFontChange = (
    property: 'family' | 'size' | 'color' | 'weight',
    value: string
  ) => {
    const currentHeaderFont = customization.headerFont || {
      family: customization.font?.family || 'system-ui, sans-serif',
      size: customization.font?.size || 'medium',
      color: customization.font?.color || '#000000'
    };
    
    onCustomizationChange({
      ...customization,
      headerFont: {
        ...currentHeaderFont,
        [property]: value
      }
    });
  };

  const handleDescriptionFontChange = (
    property: 'family' | 'size' | 'color' | 'weight',
    value: string
  ) => {
    const currentDescriptionFont = customization.descriptionFont || {
      family: customization.font?.family || 'system-ui, sans-serif',
      size: customization.font?.size || 'medium',
      color: customization.font?.color || '#000000'
    };
    
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...currentDescriptionFont,
        [property]: value
      }
    });
  };

  const handleDateTimeFontChange = (
    property: 'family' | 'size' | 'color' | 'weight',
    value: string
  ) => {
    const currentDateTimeFont = customization.dateTimeFont || {
      family: customization.font?.family || 'system-ui, sans-serif',
      size: customization.font?.size || 'medium',
      color: customization.font?.color || '#000000'
    };
    
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...currentDateTimeFont,
        [property]: value
      }
    });
  };

  return { 
    handleFontChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange
  };
};
