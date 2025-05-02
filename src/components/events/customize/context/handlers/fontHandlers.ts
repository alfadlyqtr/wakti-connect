
import { EventCustomization, TextAlign } from "@/types/event.types";

export const createFontHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleFontChange = (property: string, value: string) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    handleFontChange('family', fontFamily);
  };

  const handleFontColorChange = (color: string) => {
    handleFontChange('color', color);
  };

  const handleFontSizeChange = (size: string) => {
    handleFontChange('size', size);
  };

  const handleTextAlignmentChange = (alignment: string) => {
    handleFontChange('alignment', alignment);
  };

  const handleHeaderFontChange = (property: string, value: string) => {
    onCustomizationChange({
      ...customization,
      headerFont: {
        ...customization.headerFont,
        [property]: value
      }
    });
  };

  const handleDescriptionFontChange = (property: string, value: string) => {
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...customization.descriptionFont,
        [property]: value
      }
    });
  };

  const handleDateTimeFontChange = (property: string, value: string) => {
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...customization.dateTimeFont,
        [property]: value
      }
    });
  };

  const handleTextShadowChange = (enabled: boolean) => {
    onCustomizationChange({
      ...customization,
      textShadow: enabled
    });
  };

  return {
    handleFontChange,
    handleFontFamilyChange,
    handleFontColorChange,
    handleFontSizeChange,
    handleTextAlignmentChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange,
    handleTextShadowChange
  };
};
