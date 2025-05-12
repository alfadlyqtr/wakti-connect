
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';

const HeaderTabContent: React.FC = () => {
  const { customization, handleHeaderStyleChange } = useCustomization();
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Header style customization coming soon</Label>
      </div>
    </div>
  );
};

export default HeaderTabContent;
