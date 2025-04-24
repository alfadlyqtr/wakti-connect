import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from '@/config/maps';
import { getFormattedAddress } from '@/components/ai/tools/maps-helpers';
import { waitForGoogleMapsToLoad } from '@/utils/googleMapsLoader';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';

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

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const formattedAddress = await getFormattedAddress(latitude, longitude);
      
      setInputValue(formattedAddress);
      onChange(formattedAddress, latitude, longitude);
      
      if (onMapUrlChange) {
        onMapUrlChange(generateGoogleMapsUrl(formattedAddress));
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: "Could not get your location",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
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
        onClick={handleGetCurrentLocation}
        disabled={isSearching}
      >
        <Navigation className="h-3.5 w-3.5" />
        {isSearching ? t('location.gettingLocation') : t('location.currentLocation')}
      </Button>
    </div>
  );
};

export default LocationPickerComponent;
