import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl, waitForGoogleMapsToLoad } from '@/config/maps';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';

// Add TypeScript types for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
        Map: any;
      };
    };
  }
}

interface LocationPickerProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  className?: string;
  placeholder?: string;
  onMapUrlChange?: (url: string) => void;
}

const LocationPickerComponent: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder,
  onMapUrlChange
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value || '');
  const [isSearching, setIsSearching] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        await waitForGoogleMapsToLoad();
        console.log('Google Maps API loaded successfully');

        if (!inputRef.current) {
          console.warn('Input ref not available');
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry?.location) {
            console.warn('No location data available for selected place');
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setInputValue(place.formatted_address || '');
          onChange(place.formatted_address || '', lat, lng);
          
          if (onMapUrlChange) {
            onMapUrlChange(generateGoogleMapsUrl(place.formatted_address || ''));
          }
        });

        autocompleteRef.current = autocomplete;
        console.log('Autocomplete initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        toast({
          title: "Error",
          description: "Could not initialize location search. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializeAutocomplete();
  }, [onChange, onMapUrlChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
          placeholder={placeholder || t('location.searchPlaceholder')}
          className="pl-8 pr-10"
        />
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-xs"
        onClick={() => {
          if (!navigator.geolocation) {
            toast({
              title: "Error",
              description: "Geolocation is not supported by your browser",
              variant: "destructive"
            });
            return;
          }
          
          setIsSearching(true);
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const locationStr = `${latitude}, ${longitude}`;
              setInputValue(locationStr);
              onChange(locationStr, latitude, longitude);
              
              if (onMapUrlChange) {
                onMapUrlChange(generateGoogleMapsUrl(locationStr));
              }
              
              setIsSearching(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              toast({
                title: "Error",
                description: "Could not get your current location",
                variant: "destructive"
              });
              setIsSearching(false);
            }
          );
        }}
        disabled={isSearching}
      >
        <Navigation className="h-3.5 w-3.5" />
        {isSearching ? t('location.gettingLocation') : t('location.currentLocation')}
      </Button>
    </div>
  );
};

export default LocationPickerComponent;
