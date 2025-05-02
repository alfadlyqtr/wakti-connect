
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapDisplayType } from '@/types/event.types';

interface MapDisplayOptionsProps {
  mapDisplay: MapDisplayType;
  onMapDisplayChange: (value: MapDisplayType) => void;
}

export const MapDisplayOptions: React.FC<MapDisplayOptionsProps> = ({
  mapDisplay,
  onMapDisplayChange
}) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Map Display Options</h3>
      
      <RadioGroup 
        value={mapDisplay}
        onValueChange={(value) => onMapDisplayChange(value as MapDisplayType)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="button" id="map-button" />
          <Label htmlFor="map-button">Button only</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="both" id="map-both" />
          <Label htmlFor="map-both">Map preview with button</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="qrcode" id="map-qrcode" />
          <Label htmlFor="map-qrcode">QR code</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
