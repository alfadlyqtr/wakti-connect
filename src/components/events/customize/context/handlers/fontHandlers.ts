
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
    onCustomizationChange({
      ...customization,
      headerFont: {
        ...(customization.headerFont || {}),
        [property]: value
      }
    });
  };

  const handleDescriptionFontChange = (
    property: 'family' | 'size' | 'color' | 'weight',
    value: string
  ) => {
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...(customization.descriptionFont || {}),
        [property]: value
      }
    });
  };

  const handleDateTimeFontChange = (
    property: 'family' | 'size' | 'color' | 'weight',
    value: string
  ) => {
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...(customization.dateTimeFont || {}),
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
