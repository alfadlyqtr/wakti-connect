
import React from "react";
import { useCustomization } from "../context";
import FeaturesTab from "../tabs/FeaturesTab";

const FeaturesTabContent: React.FC = () => {
  const {
    customization,
    handleToggleCalendar,
    handleToggleButtons,
    handleBrandingChange,
    handleMapDisplayChange,
    handleUtilityButtonStyleChange,
    handlePoweredByColorChange
  } = useCustomization();

  return (
    <FeaturesTab 
      customization={customization}
      onToggleCalendar={handleToggleCalendar}
      onToggleButtons={handleToggleButtons}
      onBrandingChange={handleBrandingChange}
      onMapDisplayChange={handleMapDisplayChange}
      onUtilityButtonStyleChange={handleUtilityButtonStyleChange}
      onPoweredByColorChange={handlePoweredByColorChange}
    />
  );
};

export default FeaturesTabContent;
