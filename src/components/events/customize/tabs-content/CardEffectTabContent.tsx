
import React from 'react';
import CardEffectSelector from '../CardEffectSelector';
import { useCustomization } from '../context';
import { CardEffectType } from '@/types/event.types';

const CardEffectTabContent = () => {
  const { customization, handleCardEffectChange } = useCustomization();

  // Initialize with default values if not set
  const cardEffect = customization.cardEffect || {
    type: 'shadow' as CardEffectType,
    borderRadius: 'medium',
    border: false,
    borderColor: '#e2e8f0'
  };

  return (
    <div className="space-y-4">
      <CardEffectSelector 
        value={cardEffect} 
        onChange={handleCardEffectChange} 
      />
    </div>
  );
};

export default CardEffectTabContent;
