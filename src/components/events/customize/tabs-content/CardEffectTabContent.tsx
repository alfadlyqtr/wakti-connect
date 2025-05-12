
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';

const CardEffectTabContent: React.FC = () => {
  const { customization, handleCardEffectChange } = useCustomization();
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Card effect customization coming soon</Label>
      </div>
    </div>
  );
};

export default CardEffectTabContent;
