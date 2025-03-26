
import React, { useState } from "react";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";

interface FeaturesTabProps {
  customization: EventCustomization;
  onToggleChatbot: (checked: boolean) => void;
  onToggleCalendar: (checked: boolean) => void;
  onToggleButtons: (checked: boolean) => void;
  onBrandingChange: (property: 'logo' | 'slogan', value: string) => void;
  onMapDisplayChange: (value: 'button' | 'qrcode' | 'both') => void;
  onUtilityButtonStyleChange?: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
  onPoweredByColorChange?: (color: string) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  customization,
  onToggleChatbot,
  onToggleCalendar,
  onToggleButtons,
  onBrandingChange,
  onMapDisplayChange,
  onUtilityButtonStyleChange,
  onPoweredByColorChange
}) => {
  const [logoUrl, setLogoUrl] = useState(customization.branding?.logo || '');
  const [slogan, setSlogan] = useState(customization.branding?.slogan || '');
  
  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUrl(e.target.value);
    onBrandingChange('logo', e.target.value);
  };
  
  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlogan(e.target.value);
    onBrandingChange('slogan', e.target.value);
  };

  // Handler for utility button style changes
  const handleUtilityButtonStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    if (onUtilityButtonStyleChange) {
      onUtilityButtonStyleChange(buttonType, property, value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-base mb-3">Interactive Features</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-buttons" className="cursor-pointer">Show Accept/Decline Buttons</Label>
            <Switch 
              id="show-buttons" 
              checked={customization.showAcceptDeclineButtons !== false}
              onCheckedChange={onToggleButtons}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-calendar" className="cursor-pointer">Show Add to Calendar Button</Label>
            <Switch 
              id="show-calendar" 
              checked={customization.showAddToCalendarButton !== false}
              onCheckedChange={onToggleCalendar}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-chatbot" className="cursor-pointer">Enable Event Chatbot</Label>
            <Switch 
              id="enable-chatbot" 
              checked={customization.enableChatbot || false}
              onCheckedChange={onToggleChatbot}
            />
          </div>
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="font-medium text-base mb-3">Utility Buttons Styling</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Map Button Styling */}
          <div className="border rounded-md p-3">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Map</span>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Background</Label>
                <ColorPicker 
                  value={customization.utilityButtons?.map?.background || '#ffffff'}
                  onChange={(value) => handleUtilityButtonStyleChange('map', 'background', value)}
                />
              </div>
              <div>
                <Label className="text-xs">Text Color</Label>
                <ColorPicker 
                  value={customization.utilityButtons?.map?.color || '#000000'}
                  onChange={(value) => handleUtilityButtonStyleChange('map', 'color', value)}
                />
              </div>
            </div>
          </div>
          
          {/* QR Code Button Styling */}
          <div className="border rounded-md p-3">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="h-4 w-4" />
              <span className="font-medium">QR Code</span>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Background</Label>
                <ColorPicker 
                  value={customization.utilityButtons?.qr?.background || '#ffffff'}
                  onChange={(value) => handleUtilityButtonStyleChange('qr', 'background', value)}
                />
              </div>
              <div>
                <Label className="text-xs">Text Color</Label>
                <ColorPicker 
                  value={customization.utilityButtons?.qr?.color || '#000000'}
                  onChange={(value) => handleUtilityButtonStyleChange('qr', 'color', value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-md">
          <h4 className="text-sm font-medium mb-2">Buttons Preview</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center justify-center gap-1"
              style={getUtilityButtonStyle('map')}
            >
              <MapPin className="h-3 w-3" /> Map
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center justify-center gap-1"
              style={getUtilityButtonStyle('qr')}
            >
              <QrCode className="h-3 w-3" /> QR Code
            </Button>
          </div>
        </div>
      </div>

      <Separator />
      
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
      
      <Separator />
      
      <div>
        <h3 className="font-medium text-base mb-3">Map Display</h3>
        <RadioGroup 
          value={customization.mapDisplay || 'button'} 
          onValueChange={(value) => onMapDisplayChange(value as 'button' | 'qrcode' | 'both')}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button" id="map-button" />
            <Label htmlFor="map-button" className="cursor-pointer">Show Map Button</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qrcode" id="map-qrcode" />
            <Label htmlFor="map-qrcode" className="cursor-pointer">Show QR Code for Map</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="map-both" />
            <Label htmlFor="map-both" className="cursor-pointer">Show Both Options</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  function getUtilityButtonStyle(type: 'calendar' | 'map' | 'qr') {
    const buttonStyle = customization.utilityButtons?.[type];
    
    if (!buttonStyle) return {};
    
    return {
      backgroundColor: buttonStyle.background || undefined,
      color: buttonStyle.color || undefined,
      borderRadius: buttonStyle.shape === 'pill' ? '9999px' : 
                    buttonStyle.shape === 'rounded' ? '0.375rem' : '0'
    };
  }
};

export default FeaturesTab;
