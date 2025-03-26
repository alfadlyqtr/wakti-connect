
import React from "react";
import { useCustomization } from "../context";
import BackgroundTab from "../tabs/BackgroundTab";

const BackgroundTabContent: React.FC = () => {
  const {
    customization,
    handleBackgroundChange,
    handleAnimationChange,
    handleBackgroundAngleChange,
    handleBackgroundDirectionChange,
    handleHeaderImageChange
  } = useCustomization();

  return (
    <BackgroundTab 
      customization={customization}
      onBackgroundChange={handleBackgroundChange}
      onAnimationChange={handleAnimationChange}
      onBackgroundAngleChange={handleBackgroundAngleChange}
      onBackgroundDirectionChange={handleBackgroundDirectionChange}
      onHeaderImageChange={handleHeaderImageChange}
    />
  );
};

export default BackgroundTabContent;
