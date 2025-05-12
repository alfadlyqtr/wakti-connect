
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';

const TextTabContent: React.FC = () => {
  const { customization, handleFontChange } = useCustomization();
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Font customization coming soon</Label>
      </div>
    </div>
  );
};

export default TextTabContent;
