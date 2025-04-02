
import React from "react";
import { useCustomization } from "../context";
import TextTab from "../tabs/TextTab";

const TextTabContent = () => {
  const {
    customization,
    handleFontChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange
  } = useCustomization();

  return (
    <TextTab
      font={customization.font}
      headerFont={customization.headerFont}
      descriptionFont={customization.descriptionFont}
      dateTimeFont={customization.dateTimeFont}
      onFontChange={handleFontChange}
      onHeaderFontChange={handleHeaderFontChange}
      onDescriptionFontChange={handleDescriptionFontChange}
      onDateTimeFontChange={handleDateTimeFontChange}
    />
  );
};

export default TextTabContent;
