
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { isValidMapsUrl } from "@/utils/locationUtils";

interface LocationPickerProps {
  location: string;
  locationTitle: string;
  value?: string; // Added to support legacy usage
  onChange?: (value: any) => void; // Added to support legacy usage
  onLocationChange: (location: string, locationTitle: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  locationTitle,
  value, // Support legacy props
  onChange, // Support legacy props
  onLocationChange
}) => {
  // Use either the legacy value or the location prop
  const actualLocation = value || location;
  
  const [locationInput, setLocationInput] = useState(actualLocation);
  const [titleInput, setTitleInput] = useState(locationTitle);
  const [isValidUrl, setIsValidUrl] = useState(isValidMapsUrl(actualLocation));
  
  useEffect(() => {
    setLocationInput(actualLocation);
    setTitleInput(locationTitle);
    setIsValidUrl(isValidMapsUrl(actualLocation));
  }, [actualLocation, locationTitle]);
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocationInput(newLocation);
    setIsValidUrl(isValidMapsUrl(newLocation));
    onLocationChange(newLocation, titleInput);
    
    // Support legacy onChange if provided
    if (onChange) {
      onChange(newLocation);
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleInput(newTitle);
    onLocationChange(locationInput, newTitle);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-url">Google Maps URL</Label>
        <div className="flex space-x-2">
          <Input
            id="location-url"
            value={locationInput}
            onChange={handleLocationChange}
            placeholder="Paste a Google Maps URL"
            className={`flex-1 ${!isValidUrl && locationInput ? 'border-red-500' : ''}`}
          />
          {isValidUrl && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.open(locationInput, '_blank')}
              className="whitespace-nowrap"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Test Link
            </Button>
          )}
        </div>
        {!isValidUrl && locationInput && (
          <p className="text-sm text-red-500">Please enter a valid Google Maps URL</p>
        )}
        <p className="text-xs text-muted-foreground">
          Copy and paste a Google Maps URL to provide directions to your event location
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location-title">Location Title (Optional)</Label>
        <Input
          id="location-title"
          value={titleInput}
          onChange={handleTitleChange}
          placeholder="e.g., Company HQ, Main Entrance, etc."
        />
        <p className="text-xs text-muted-foreground">
          Add a friendly name for the location that will be displayed to attendees
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
