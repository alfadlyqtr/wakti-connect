
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { waitForGoogleMapsToLoad } from '@/utils/googleMapsLoader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { GOOGLE_MAPS_API_KEY } from '@/config/maps';

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
  placeholder
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        await waitForGoogleMapsToLoad();
        
        if (!inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name', 'address_components']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry?.location) {
            console.warn('No location data available for selected place');
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const displayName = place.formatted_address || place.name || '';
          
          onChange(displayName, lat, lng);
        });

        autocompleteRef.current = autocomplete;
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
  }, [onChange]);

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
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // Make sure Google Maps API is loaded
      await waitForGoogleMapsToLoad();
      
      // Use the Geocoding API to get a human-readable address
      const geocoder = new window.google.maps.Geocoder();
      
      const handleGeocodeResult = (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          // Get the most detailed address possible
          const address = results[0].formatted_address;
          onChange(address, latitude, longitude);
        } else {
          console.warn(`Geocoding failed with status: ${status}`);
          toast({
            title: "Location Found",
            description: "Could not get exact address, please try searching manually",
            variant: "destructive"
          });
        }
        setIsSearching(false);
      };

      // Attempt to geocode with multiple retries
      let retryCount = 0;
      const maxRetries = 3;

      const attemptGeocode = () => {
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              handleGeocodeResult(results, status);
            } else if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Geocoding attempt ${retryCount} failed, retrying...`);
              setTimeout(attemptGeocode, 1000);
            } else {
              handleGeocodeResult(results, status);
            }
          }
        );
      };

      attemptGeocode();

    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: error.message || "Could not get your current location",
        variant: "destructive"
      });
      setIsSearching(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={inputRef}
          placeholder={placeholder || "Search for a location"}
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
        {isSearching ? (
          <>
            <LoadingSpinner size="sm" />
            Getting your location...
          </>
        ) : (
          <>
            <Navigation className="h-3.5 w-3.5" />
            Use my current location
          </>
        )}
      </Button>
    </div>
  );
};

export default LocationPicker;
