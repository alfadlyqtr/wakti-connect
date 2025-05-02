
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FontSelector from '../FontSelector';
import TextShadowToggle from './TextShadowToggle';

const TextTabContent = () => {
  const { 
    customization, 
    handleFontFamilyChange,
    handleFontColorChange,
    handleFontSizeChange,
    handleTextAlignmentChange
  } = useCustomization();
  
  const handleFontChange = (property: string, value: string) => {
    switch(property) {
      case 'family':
        handleFontFamilyChange(value);
        break;
      case 'color':
        handleFontColorChange(value);
        break;
      case 'size':
        handleFontSizeChange(value);
        break;
      case 'alignment':
        handleTextAlignmentChange(value);
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b">
        <FontSelector 
          font={customization.font} 
          onFontChange={handleFontChange}
          showAlignment={true}
          showWeight={true}
          previewText="Preview text styling"
        />
      </div>
      
      <TextShadowToggle />
    </div>
  );
};

export default TextTabContent;
