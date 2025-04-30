
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MapDisplayOptionsProps {
  mapDisplay: 'button' | 'both';
  onMapDisplayChange: (value: 'button' | 'both') => void;
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
        onValueChange={(value) => onMapDisplayChange(value as 'button' | 'both')}
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
      </RadioGroup>
    </div>
  );
};
