
import React from "react";
import { useCustomization } from "../context";
import BackgroundTab from "../tabs/BackgroundTab";

const BackgroundTabContent = () => {
  const {
    customization,
    handleBackgroundChange,
    handleBackgroundAngleChange,
    handleBackgroundDirectionChange,
    handleHeaderImageChange,
    handleAnimationChange
  } = useCustomization();

  return (
    <BackgroundTab
      backgroundType={customization.background.type}
      backgroundValue={customization.background.value}
      backgroundAngle={customization.background.angle}
      backgroundDirection={customization.background.direction}
      headerImage={customization.headerImage}
      animation={customization.animation}
      onBackgroundChange={(type, value) => {
        // Convert 'color' to 'solid' for compatibility
        const adjustedType = type === 'color' ? 'solid' : type;
        handleBackgroundChange(adjustedType, value);
      }}
      onBackgroundAngleChange={handleBackgroundAngleChange}
      onBackgroundDirectionChange={handleBackgroundDirectionChange}
      onHeaderImageChange={handleHeaderImageChange}
      onAnimationChange={handleAnimationChange}
    />
  );
};

export default BackgroundTabContent;
