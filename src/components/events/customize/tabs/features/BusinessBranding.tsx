
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventCustomization } from "@/types/event.types";
import { ColorInput } from "@/components/inputs/ColorInput";
import { useTranslation } from "react-i18next";

interface BusinessBrandingProps {
  customization: EventCustomization;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onPoweredByColorChange?: (color: string) => void;
}

export const BusinessBranding: React.FC<BusinessBrandingProps> = ({
  customization,
  onBrandingChange,
  onPoweredByColorChange
}) => {
  const { t } = useTranslation();
  
  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBrandingChange('logo', e.target.value);
  };
  
  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBrandingChange('slogan', e.target.value);
  };
  
  return (
    <div>
      <h3 className="font-medium text-base mb-3">{t("events.businessBranding")}</h3>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="logo-url">{t("events.logoUrl")}</Label>
          <Input 
            id="logo-url" 
            placeholder="https://example.com/logo.png" 
            value={customization.branding?.logo || ''} 
            onChange={handleLogoUrlChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branding-slogan">{t("events.businessSlogan")}</Label>
          <Input 
            id="branding-slogan" 
            placeholder="Your catchy slogan" 
            value={customization.branding?.slogan || ''} 
            onChange={handleSloganChange}
          />
        </div>
        
        {onPoweredByColorChange && (
          <div className="space-y-2">
            <Label htmlFor="powered-by-color">{t("events.footerColor")}</Label>
            <ColorInput 
              id="powered-by-color"
              value={customization.poweredByColor || '#666666'} 
              onChange={(color) => onPoweredByColorChange(color)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("events.footerColorDesc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
