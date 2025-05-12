
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';

const ButtonsTabContent: React.FC = () => {
  const { customization, handleButtonStyleChange } = useCustomization();
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Button customization coming soon</Label>
      </div>
    </div>
  );
};

export default ButtonsTabContent;
