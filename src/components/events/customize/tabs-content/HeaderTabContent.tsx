
import React from 'react';
import { useCustomization } from '../context';
import HeaderStyleSelector from '../HeaderStyleSelector';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const HeaderTabContent: React.FC = () => {
  const { 
    customization, 
    handleHeaderStyleChange, 
    handleHeaderImageChange,
    handleBrandingChange 
  } = useCustomization();
  
  return (
    <div className="space-y-6">
      <HeaderStyleSelector 
        value={customization.headerStyle || 'simple'}
        onChange={handleHeaderStyleChange || (() => {})}
      />
      
      <Separator />
      
      {customization.headerStyle === 'banner' && (
        <div className="space-y-3">
          <Label htmlFor="header-image">Banner Image URL</Label>
          <Input 
            id="header-image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={customization.headerImage || ''}
            onChange={(e) => handleHeaderImageChange && handleHeaderImageChange(e.target.value)}
          />
          {customization.headerImage && (
            <div className="mt-2 rounded-md overflow-hidden border h-32">
              <img 
                src={customization.headerImage} 
                alt="Header banner preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x200?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
        </div>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-base font-medium">Branding</h3>
        
        <div className="space-y-3">
          <Label htmlFor="branding-logo">Logo URL</Label>
          <Input
            id="branding-logo"
            type="url"
            placeholder="https://example.com/logo.png"
            value={customization.branding?.logo || ''}
            onChange={(e) => handleBrandingChange && handleBrandingChange('logo', e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="branding-slogan">Tagline/Slogan</Label>
          <Input
            id="branding-slogan"
            placeholder="Your company slogan"
            value={customization.branding?.slogan || ''}
            onChange={(e) => handleBrandingChange && handleBrandingChange('slogan', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderTabContent;
