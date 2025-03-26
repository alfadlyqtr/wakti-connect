
import React from "react";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { MapPin, QrCode } from "lucide-react";
import { EventCustomization } from "@/types/event.types";

interface UtilityButtonsStyleProps {
  customization: EventCustomization;
  onUtilityButtonStyleChange?: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
}

export const UtilityButtonsStyle: React.FC<UtilityButtonsStyleProps> = ({
  customization,
  onUtilityButtonStyleChange,
}) => {
  const handleUtilityButtonStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    if (onUtilityButtonStyleChange) {
      onUtilityButtonStyleChange(buttonType, property, value);
    }
  };

  const getUtilityButtonStyle = (type: 'calendar' | 'map' | 'qr') => {
    const buttonStyle = customization.utilityButtons?.[type];
    
    if (!buttonStyle) return {};
    
    return {
      backgroundColor: buttonStyle.background || undefined,
      color: buttonStyle.color || undefined,
      borderRadius: buttonStyle.shape === 'pill' ? '9999px' : 
                    buttonStyle.shape === 'rounded' ? '0.375rem' : '0'
    };
  };

  return (
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
  );
};
