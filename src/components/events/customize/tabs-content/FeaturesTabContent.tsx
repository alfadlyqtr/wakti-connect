
import React from "react";
import { useCustomization } from "../context/CustomizationContext";
import FeaturesTab from "../tabs/FeaturesTab";

const FeaturesTabContent: React.FC = () => {
  const {
    customization,
    handleToggleChatbot,
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleMapDisplayChange
  } = useCustomization();

  return (
    <FeaturesTab 
      customization={customization}
      onToggleChatbot={handleToggleChatbot}
      onToggleCalendar={handleToggleCalendar}
      onToggleButtons={handleToggleButtons}
      onBrandingChange={handleBrandingChange}
      onMapDisplayChange={handleMapDisplayChange}
    />
  );
};

export default FeaturesTabContent;
