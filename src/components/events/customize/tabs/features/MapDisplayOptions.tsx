
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MapDisplayOptionsProps {
  mapDisplay: string;
  onMapDisplayChange: (value: 'button' | 'qrcode' | 'both') => void;
}

export const MapDisplayOptions: React.FC<MapDisplayOptionsProps> = ({
  mapDisplay,
  onMapDisplayChange,
}) => {
  const safeMapDisplay = mapDisplay || 'button';
  
  const handleValueChange = (value: string) => {
    onMapDisplayChange(value as 'button' | 'qrcode' | 'both');
  };
  
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Map Display</h3>
      <RadioGroup 
        value={safeMapDisplay} 
        onValueChange={handleValueChange}
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
  );
};
