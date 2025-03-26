
import React from "react";
import { useCustomization } from "../context";
import FeaturesTab from "../tabs/FeaturesTab";

const FeaturesTabContent: React.FC = () => {
  const {
    customization,
    handleToggleChatbot,
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleMapDisplayChange,
    handleUtilityButtonStyleChange
  } = useCustomization();

  return (
    <FeaturesTab 
      customization={customization}
      onToggleChatbot={handleToggleChatbot}
      onToggleCalendar={handleToggleCalendar}
      onToggleButtons={handleToggleButtons}
      onBrandingChange={handleBrandingChange}
      onMapDisplayChange={handleMapDisplayChange}
      onUtilityButtonStyleChange={handleUtilityButtonStyleChange}
    />
  );
};

export default FeaturesTabContent;
