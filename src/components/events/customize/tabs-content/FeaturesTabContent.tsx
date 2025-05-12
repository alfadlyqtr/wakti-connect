
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';

const FeaturesTabContent: React.FC = () => {
  const { customization } = useCustomization();
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Features customization coming soon</Label>
      </div>
    </div>
  );
};

export default FeaturesTabContent;
