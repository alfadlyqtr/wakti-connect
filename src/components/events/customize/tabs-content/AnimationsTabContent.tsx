
import React from "react";
import { useCustomization } from "../context";
import ElementAnimationsSelector from "../ElementAnimationsSelector";
import { ElementAnimations } from "@/types/event.types";

const AnimationsTabContent: React.FC = () => {
  const {
    customization,
    handleElementAnimationsChange
  } = useCustomization();

  // Ensure we're using the correct types
  const defaultAnimations: ElementAnimations = {
    text: 'none',
    buttons: 'none',
    icons: 'none',
    delay: 'none'
  };

  return (
    <ElementAnimationsSelector 
      value={customization.elementAnimations || defaultAnimations}
      onChange={handleElementAnimationsChange}
    />
  );
};

export default AnimationsTabContent;
