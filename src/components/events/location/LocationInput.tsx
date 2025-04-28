
import React from 'react';
import { MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';

interface LocationInputProps {
  location: string;
  onLocationChange: (displayLocation: string, mapsUrl?: string, lat?: number, lng?: number) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  location,
  onLocationChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <MapPin className="h-4 w-4 mt-2 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <LocationPicker
            value={location}
            onChange={onLocationChange}
            placeholder="Enter a location or use your current location"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a location manually, use your current location, or paste a Google Maps link
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
