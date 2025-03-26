
import React from "react";
import { useCustomization } from "../context/CustomizationContext";
import CardEffectSelector from "../CardEffectSelector";

const CardEffectTabContent: React.FC = () => {
  const {
    customization,
    handleCardEffectChange
  } = useCustomization();

  return (
    <CardEffectSelector 
      value={customization.cardEffect || {
        type: 'shadow',
        borderRadius: 'medium',
        border: false
      }}
      onChange={handleCardEffectChange}
    />
  );
};

export default CardEffectTabContent;
