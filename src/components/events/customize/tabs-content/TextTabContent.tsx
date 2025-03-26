
import React from "react";
import { useCustomization } from "../context";
import TextTab from "../tabs/TextTab";

const TextTabContent: React.FC = () => {
  const {
    customization,
    handleFontChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange
  } = useCustomization();

  return (
    <TextTab 
      customization={customization}
      onFontChange={handleFontChange}
      onHeaderFontChange={handleHeaderFontChange}
      onDescriptionFontChange={handleDescriptionFontChange}
      onDateTimeFontChange={handleDateTimeFontChange}
    />
  );
};

export default TextTabContent;
