
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface MapDisplayOptionsProps {
  mapDisplay: string;
  onMapDisplayChange: (value: 'button' | 'both') => void;
  showMap?: boolean;
  onShowMapChange?: (value: boolean) => void;
}

export const MapDisplayOptions: React.FC<MapDisplayOptionsProps> = ({
  mapDisplay,
  onMapDisplayChange,
  showMap,
  onShowMapChange,
}) => {
  const safeMapDisplay = mapDisplay || 'button';
  
  const handleValueChange = (value: string) => {
    onMapDisplayChange(value as 'button' | 'both');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-base mb-3">Map Display Options</h3>
        <RadioGroup 
          value={safeMapDisplay} 
          onValueChange={handleValueChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="button" id="map-button" />
            <Label htmlFor="map-button" className="cursor-pointer">Show map button</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="map-both" />
            <Label htmlFor="map-both" className="cursor-pointer">Show button with preview</Label>
          </div>
        </RadioGroup>
      </div>
      
      {typeof onShowMapChange === 'function' && (
        <div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-map-preview"
              checked={showMap}
              onCheckedChange={onShowMapChange}
            />
            <Label htmlFor="show-map-preview">Show map preview</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Display a small map preview on the event page
          </p>
        </div>
      )}
    </div>
  );
};
