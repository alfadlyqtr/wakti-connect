
import React from "react";
import { useCustomization } from "../context/CustomizationContext";
import ElementAnimationsSelector from "../ElementAnimationsSelector";

const AnimationsTabContent: React.FC = () => {
  const {
    customization,
    handleElementAnimationsChange
  } = useCustomization();

  return (
    <ElementAnimationsSelector 
      value={customization.elementAnimations || {
        text: 'none',
        buttons: 'none',
        icons: 'none',
        delay: 'none'
      }}
      onChange={handleElementAnimationsChange}
    />
  );
};

export default AnimationsTabContent;
