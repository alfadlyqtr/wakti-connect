
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  locationType?: "manual" | "google_maps";
  mapsUrl?: string;
  onLocationChange?: (value: string, type: "manual" | "google_maps", mapsUrl?: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter a location...',
  locationType = "manual",
  mapsUrl,
  onLocationChange
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelectLocation = (location: string) => {
    if (onLocationChange) {
      onLocationChange(location, "google_maps", `https://maps.google.com/maps?q=${encodeURIComponent(location)}`);
    } else {
      onChange(location);
    }
    setIsPickerOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onLocationChange) {
      onLocationChange(newValue, "manual");
    } else {
      onChange(newValue);
    }
  };

  const openMaps = () => {
    if (value) {
      const url = mapsUrl || `https://maps.google.com/maps?q=${encodeURIComponent(value)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="rounded-r-none"
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-l-none border-l-0"
          onClick={() => setIsPickerOpen(true)}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      {value && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs"
          onClick={openMaps}
        >
          View on Maps
        </Button>
      )}
      
      <LocationPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  );
};

export default LocationInput;
