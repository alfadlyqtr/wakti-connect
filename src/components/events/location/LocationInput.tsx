
import React from 'react';
import { MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { formatLocation } from '@/utils/locationUtils';

interface LocationInputProps {
  location: string;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  location,
  onLocationChange,
}) => {
  const formattedLocation = formatLocation(location);
  
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <MapPin className="h-4 w-4 mt-2 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <LocationPicker
            value={location}
            onChange={onLocationChange}
          />
          
          {location && (
            <div className="mt-2 text-sm p-2 bg-muted/50 rounded-md">
              <p className="font-medium">Selected location:</p>
              <p className="text-muted-foreground">{formattedLocation}</p>
            </div>
          )}
          
          {!location && (
            <p className="text-xs text-muted-foreground mt-1">
              Enter a location or add a Google Maps link
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
