
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCustomization } from "@/types/event.types";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UtilityButtonsStyleProps {
  customization: EventCustomization;
  onUtilityButtonStyleChange?: (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => void;
}

export const UtilityButtonsStyle: React.FC<UtilityButtonsStyleProps> = ({
  customization,
  onUtilityButtonStyleChange
}) => {
  if (!onUtilityButtonStyleChange) return null;
  
  const getButtonStyles = (type: 'calendar' | 'map' | 'qr') => {
    if (!customization.utilityButtons) return { background: '#ffffff', color: '#000000', shape: 'rounded' };
    
    return customization.utilityButtons[type] || { background: '#ffffff', color: '#000000', shape: 'rounded' };
  };

  const handleStyleChange = (buttonType: 'calendar' | 'map' | 'qr', property: 'background' | 'color' | 'shape', value: string) => {
    onUtilityButtonStyleChange(buttonType, property, value);
  };

  return (
    <div>
      <h3 className="font-medium text-base mb-3">Utility Button Styles</h3>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        {/* Calendar Button Styling */}
        <TabsContent value="calendar" className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="calendar-bg-color">Background Color</Label>
            <ColorInput 
              id="calendar-bg-color"
              value={getButtonStyles('calendar').background} 
              onChange={(color) => handleStyleChange('calendar', 'background', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calendar-text-color">Text Color</Label>
            <ColorInput 
              id="calendar-text-color"
              value={getButtonStyles('calendar').color} 
              onChange={(color) => handleStyleChange('calendar', 'color', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calendar-shape">Button Shape</Label>
            <Select 
              value={getButtonStyles('calendar').shape} 
              onValueChange={(value) => handleStyleChange('calendar', 'shape', value)}
            >
              <SelectTrigger id="calendar-shape">
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* Map Button Styling */}
        <TabsContent value="map" className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="map-bg-color">Background Color</Label>
            <ColorInput 
              id="map-bg-color"
              value={getButtonStyles('map').background} 
              onChange={(color) => handleStyleChange('map', 'background', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="map-text-color">Text Color</Label>
            <ColorInput 
              id="map-text-color"
              value={getButtonStyles('map').color} 
              onChange={(color) => handleStyleChange('map', 'color', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="map-shape">Button Shape</Label>
            <Select 
              value={getButtonStyles('map').shape} 
              onValueChange={(value) => handleStyleChange('map', 'shape', value)}
            >
              <SelectTrigger id="map-shape">
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* QR Code Button Styling */}
        <TabsContent value="qr" className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="qr-bg-color">Background Color</Label>
            <ColorInput 
              id="qr-bg-color"
              value={getButtonStyles('qr').background}

              onChange={(color) => handleStyleChange('qr', 'background', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qr-text-color">Text Color</Label>
            <ColorInput 
              id="qr-text-color"
              value={getButtonStyles('qr').color} 
              onChange={(color) => handleStyleChange('qr', 'color', color)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qr-shape">Button Shape</Label>
            <Select 
              value={getButtonStyles('qr').shape} 
              onValueChange={(value) => handleStyleChange('qr', 'shape', value)}
            >
              <SelectTrigger id="qr-shape">
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
