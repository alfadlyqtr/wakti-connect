
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from '@/config/maps';
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
  const [placeDetails, setPlaceDetails] = useState<{
    name?: string;
    address?: string;
    lat?: number;
    lng?: number;
    url?: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'name', 'place_id'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        // Update with place details
        const placeData = {
          name: place.name || '',
          address: place.formatted_address || '',
          lat,
          lng,
          url: generateGoogleMapsUrl(place.formatted_address || '')
        };
        
        setPlaceDetails(placeData);
        setInputValue(place.formatted_address || '');
        
        // Pass back location and coordinates
        onChange(place.formatted_address || '', lat, lng);
        
        // Generate a Google Maps URL and pass it back if handler provided
        if (onMapUrlChange) {
          onMapUrlChange(placeData.url);
        }
      }
    });

    autocompleteRef.current = autocomplete;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      setPlaceDetails(null);
      onChange('');
      if (onMapUrlChange) {
        onMapUrlChange('');
      }
    }
  };

  const getCurrentLocation = () => {
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Google's Geocoding service to get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            setInputValue(address);
            
            // Update place details
            setPlaceDetails({
              name: address,
              address,
              lat: latitude,
              lng: longitude,
              url: generateGoogleMapsUrl(address)
            });
            
            // Pass back location and coordinates
            onChange(address, latitude, longitude);
            
            // Generate maps URL if handler provided
            if (onMapUrlChange) {
              onMapUrlChange(generateGoogleMapsUrl(address));
            }
            
            toast({
              title: "Location Found",
              description: "Your current location has been added"
            });
          }
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
          toast({
            title: "Error",
            description: "Could not get your current location address",
            variant: "destructive"
          });
        }
        
        setIsSearching(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsSearching(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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
        onClick={getCurrentLocation}
        disabled={isSearching}
      >
        <Navigation className="h-3.5 w-3.5" />
        {isSearching ? t('location.gettingLocation') : t('location.currentLocation')}
      </Button>
    </div>
  );
};

export default LocationPickerComponent;

