
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCustomization } from '../context';

const TextShadowToggle: React.FC = () => {
  const { customization, setCustomization } = useCustomization();
  
  const handleToggleTextShadow = (checked: boolean) => {
    setCustomization({
      ...customization,
      textShadow: checked
    });
  };
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor="text-shadow" className="font-medium">Text Shadow</Label>
        <p className="text-sm text-muted-foreground">
          Improve text visibility on image backgrounds
        </p>
      </div>
      <Switch 
        id="text-shadow" 
        checked={customization.textShadow === true}
        onCheckedChange={handleToggleTextShadow}
      />
    </div>
  );
};

export default TextShadowToggle;
