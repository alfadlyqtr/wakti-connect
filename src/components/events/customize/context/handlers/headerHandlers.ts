
import { EventCustomization } from "@/types/event.types";

export const createHeaderHandlers = (
  customization: EventCustomization,
  onCustomizationChange: (customization: EventCustomization) => void
) => {
  const handleHeaderStyleChange = (style: 'banner' | 'simple' | 'minimal') => {
    onCustomizationChange({
      ...customization,
      headerStyle: style
    });
  };

  const handleHeaderImageChange = (imageUrl: string) => {
    onCustomizationChange({
      ...customization,
      headerImage: imageUrl
    });
  };

  return {
    handleHeaderStyleChange,
    handleHeaderImageChange
  };
};
