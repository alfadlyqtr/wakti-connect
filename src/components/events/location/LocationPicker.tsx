
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from '@/config/maps';

// Add TypeScript types for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: any
          ) => google.maps.places.Autocomplete;
        };
        Map: any;
      };
    };
  }
}

// Define the minimal Google Maps types we need
namespace google.maps.places {
  export interface Autocomplete {
    addListener: (event: string, callback: () => void) => void;
    getPlace: () => {
      formatted_address?: string;
      geometry?: {
        location?: {
          lat: () => number;
          lng: () => number;
        };
      };
      name?: string;
    };
  }
}

interface LocationPickerProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  className?: string;
  placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Enter a location'
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (scriptLoaded && inputRef.current && window.google) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['establishment', 'geocode']
        });
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            setInputValue(place.formatted_address);
            
            // Pass back the location and coordinates if available
            onChange(
              place.formatted_address,
              place.geometry?.location?.lat(),
              place.geometry?.location?.lng()
            );
          }
        });
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
      }
    }
  }, [scriptLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-8"
          />
        </div>
        {inputValue && (
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            className="ml-2"
            onClick={() => window.open(generateGoogleMapsUrl(inputValue), '_blank')}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
