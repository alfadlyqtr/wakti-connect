
import React from "react";
import { useCustomization } from "../context";
import BackgroundTab from "../tabs/BackgroundTab";
import { BackgroundType } from "@/types/event.types";

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
  const convertBackgroundTypeToUI = (type: BackgroundType): "color" | "gradient" | "image" => {
    // Map 'solid' to 'color' for compatibility with BackgroundTab component
    return type === 'solid' ? 'color' : (type as "gradient" | "image");
  };

  return (
    <BackgroundTab
      backgroundType={convertBackgroundTypeToUI(customization.background.type)}
      backgroundValue={customization.background.value}
      backgroundAngle={customization.background.angle}
      backgroundDirection={customization.background.direction}
      headerImage={customization.headerImage}
      animation={customization.animation}
      onBackgroundChange={handleBackgroundChange}
      onBackgroundAngleChange={handleBackgroundAngleChange}
      onBackgroundDirectionChange={handleBackgroundDirectionChange}
      onHeaderImageChange={handleHeaderImageChange}
      onAnimationChange={handleAnimationChange}
    />
  );
};

export default BackgroundTabContent;
