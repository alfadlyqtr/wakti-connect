
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { formatLocation } from '@/utils/locationUtils';
import LocationDialog from './LocationDialog';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
  className?: string;
  placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = "Add location",
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const formattedLocation = formatLocation(value);

  return (
    <div className={`${className}`}>
      <Button
        type="button"
        variant="outline"
        className={`w-full flex items-start justify-start gap-2 h-auto py-2 px-3 ${!value ? 'text-muted-foreground' : ''}`}
        onClick={() => setDialogOpen(true)}
      >
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span className="text-left">
          {formattedLocation || placeholder}
        </span>
      </Button>

      <LocationDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onLocationSelect={onChange}
      />
    </div>
  );
};

export default LocationPicker;
