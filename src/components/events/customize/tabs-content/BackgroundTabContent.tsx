
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

  // Convert between type values used in UI and the internal values
  const convertBackgroundType = (type: 'solid' | 'gradient' | 'image'): 'color' | 'gradient' | 'image' => {
    // Map 'solid' to 'color' for compatibility with BackgroundTab component
    return type === 'solid' ? 'color' : type;
  };

  return (
    <BackgroundTab
      backgroundType={convertBackgroundType(customization.background.type)}
      backgroundValue={customization.background.value}
      backgroundAngle={customization.background.angle}
      backgroundDirection={customization.background.direction}
      headerImage={customization.headerImage}
      animation={customization.animation}
      onBackgroundChange={(type, value) => {
        // Convert 'color' back to 'solid' for internal representation
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
