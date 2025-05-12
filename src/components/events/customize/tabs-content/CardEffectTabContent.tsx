
import React from 'react';
import { useCustomization } from '../context';
import CardEffectSelector from '../CardEffectSelector';

const CardEffectTabContent: React.FC = () => {
  const { customization, handleCardEffectChange } = useCustomization();
  
  const defaultCardEffect = {
    type: 'shadow' as 'shadow' | 'matte' | 'gloss',
    borderRadius: 'medium' as 'none' | 'small' | 'medium' | 'large',
    border: false,
    borderColor: '#e2e8f0'
  };
  
  return (
    <div className="space-y-6">
      <CardEffectSelector 
        value={customization.cardEffect || defaultCardEffect}
        onChange={handleCardEffectChange}
      />
    </div>
  );
};

export default CardEffectTabContent;
