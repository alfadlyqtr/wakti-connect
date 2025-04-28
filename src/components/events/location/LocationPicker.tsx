
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { loadGoogleMapsApi, waitForGoogleMapsToLoad } from '@/utils/googleMapsLoader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        setIsLoading(true);
        console.log('[LocationPicker] Starting initialization...');
        
        await loadGoogleMapsApi();
        await waitForGoogleMapsToLoad();
        
        console.log('[LocationPicker] Maps loaded, initializing Autocomplete...');
        
        if (!inputRef.current) {
          console.error('[LocationPicker] Input reference not available');
          return;
        }

        // Initialize Places Autocomplete with expanded options
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name', 'place_id'],
          types: ['geocode', 'establishment', 'regions', 'cities'],
        });

        console.log('[LocationPicker] Autocomplete instance created');

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('[LocationPicker] Place selected:', place);
          
          if (!place.geometry?.location) {
            toast({
              title: "Location Error",
              description: "Please select a location from the dropdown",
              variant: "destructive"
            });
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const displayName = place.formatted_address || place.name || '';
          
          setInputValue(displayName);
          onChange(displayName, lat, lng);
        });

        autocompleteRef.current = autocomplete;
        setIsInitialized(true);
        console.log('[LocationPicker] Initialization complete');
      } catch (error) {
        console.error('[LocationPicker] Error initializing:', error);
        toast({
          title: "Error",
          description: "Could not initialize location search. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInitialized) {
      initializeGoogleMaps();
    }
  }, [onChange, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Don't call onChange here - let the Places Autocomplete handle it
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
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      await waitForGoogleMapsToLoad();
      
      const { latitude, longitude } = position.coords;
      const geocoder = new google.maps.Geocoder();
      
      const geocodeWithRetry = async (retryCount = 0, maxRetries = 3) => {
        try {
          const response = await new Promise((resolve, reject) => {
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(results[0]);
                } else {
                  reject(new Error(`Geocoding failed with status: ${status}`));
                }
              }
            );
          });

          const result = response as google.maps.GeocoderResult;
          const address = result.formatted_address;
          setInputValue(address);
          onChange(address, latitude, longitude);
          
        } catch (error) {
          if (retryCount < maxRetries) {
            console.log(`Geocoding attempt ${retryCount + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return geocodeWithRetry(retryCount + 1, maxRetries);
          }
          throw error;
        }
      };

      await geocodeWithRetry();

    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: error.message || "Could not get your current location",
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
          placeholder={isLoading ? "Loading location search..." : (placeholder || "Search for a location")}
          className="pl-8 pr-10"
          disabled={!isInitialized || isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-xs"
        onClick={handleGetCurrentLocation}
        disabled={isSearching || !isInitialized}
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
