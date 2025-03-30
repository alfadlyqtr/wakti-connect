
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { generateGoogleMapsUrl } from '@/config/maps';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter a location...'
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelectLocation = (location: string) => {
    onChange(location);
    setIsPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          onClick={() => window.open(generateGoogleMapsUrl(value), '_blank')}
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
