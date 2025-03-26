
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { EventCustomization } from "@/types/event.types";

interface BusinessBrandingProps {
  customization: EventCustomization;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onPoweredByColorChange?: (color: string) => void;
}

export const BusinessBranding: React.FC<BusinessBrandingProps> = ({
  customization,
  onBrandingChange,
  onPoweredByColorChange,
}) => {
  const [logoUrl, setLogoUrl] = useState(customization.branding?.logo || '');
  const [slogan, setSlogan] = useState(customization.branding?.slogan || '');
  
  // Update internal state when customization changes
  useEffect(() => {
    setLogoUrl(customization.branding?.logo || '');
    setSlogan(customization.branding?.slogan || '');
  }, [customization.branding?.logo, customization.branding?.slogan]);
  
  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUrl(e.target.value);
    onBrandingChange('logo', e.target.value);
  };
  
  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlogan(e.target.value);
    onBrandingChange('slogan', e.target.value);
  };

  return (
    <div>
      <h3 className="font-medium text-base mb-3">Business Branding</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="logo-url">Logo URL</Label>
          <Input 
            id="logo-url" 
            value={logoUrl} 
            onChange={handleLogoUrlChange} 
            placeholder="Enter URL for your logo"
          />
        </div>
        
        <div>
          <Label htmlFor="slogan">Business Slogan</Label>
          <Input 
            id="slogan" 
            value={slogan} 
            onChange={handleSloganChange} 
            placeholder="Your business slogan or tagline"
          />
        </div>
        
        <div>
          <Label htmlFor="powered-by-color">Powered by WAKTI Color</Label>
          <ColorPicker 
            value={customization.poweredByColor || '#888888'} 
            onChange={(value) => onPoweredByColorChange && onPoweredByColorChange(value)} 
          />
        </div>
      </div>
      
      {(logoUrl || slogan) && (
        <div className="p-3 bg-muted/30 rounded-md mt-3 flex flex-col items-center">
          <h4 className="text-xs font-medium mb-2">Branding Preview</h4>
          {logoUrl && (
            <img src={logoUrl} alt="Business logo" className="h-8 object-contain mb-1" />
          )}
          {slogan && (
            <p className="text-xs text-muted-foreground">{slogan}</p>
          )}
          <p 
            className="text-xs mt-2" 
            style={{ color: customization.poweredByColor || '#888888' }}
          >
            Powered by WAKTI
          </p>
        </div>
      )}
    </div>
  );
};
