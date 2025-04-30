
import { EventCustomization } from "@/types/event.types";

export const createFontHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
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
    // Create headerFont object if it doesn't exist
    const currentHeaderFont = customization.headerFont || {
      family: customization.font.family,
      size: 'large',
      color: customization.font.color,
      weight: 'semibold'
    };

    onCustomizationChange({
      ...customization,
      headerFont: {
        ...currentHeaderFont,
        [property]: value
      }
    });
  };

  const handleDescriptionFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    // Create descriptionFont object if it doesn't exist
    const currentDescriptionFont = customization.descriptionFont || {
      family: customization.font.family,
      size: 'medium',
      color: customization.font.color,
      weight: 'normal'
    };

    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...currentDescriptionFont,
        [property]: value
      }
    });
  };

  const handleDateTimeFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    // Create dateTimeFont object if it doesn't exist
    const currentDateTimeFont = customization.dateTimeFont || {
      family: customization.font.family,
      size: 'small',
      color: customization.font.color,
      weight: 'normal'
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
