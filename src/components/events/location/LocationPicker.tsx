import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from '@/config/maps';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';

// Define the minimal Google Maps types we need without using namespace
interface GoogleMapsPlaceAutocomplete {
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
    place_id?: string;
    url?: string;
  };
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
  const autocompleteRef = useRef<GoogleMapsPlaceAutocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<{
    name?: string;
    address?: string;
    lat?: number;
    lng?: number;
    url?: string;
  } | null>(null);

  // Load Google Maps script directly with the static API key
  useEffect(() => {
    if (window.google?.maps) {
      setScriptLoaded(true);
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
    }
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (scriptLoaded && inputRef.current && window.google?.maps) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name', 'place_id', 'url'],
          types: ['establishment', 'geocode']
        });
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place) {
            const placeData = {
              name: place.name,
              address: place.formatted_address,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
              url: place.url
            };
            
            setPlaceDetails(placeData);
            
            // Update with the formatted address or name if address is not available
            const locationName = place.formatted_address || place.name || '';
            setInputValue(locationName);
            
            // Pass back the location and coordinates if available
            onChange(
              locationName,
              placeData.lat,
              placeData.lng
            );
            
            // If we have coordinates, generate a maps URL and pass it back if handler provided
            if (placeData.lat && placeData.lng && onMapUrlChange) {
              const mapsUrl = generateGoogleMapsUrl(`${placeData.lat},${placeData.lng}`);
              onMapUrlChange(mapsUrl);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
      }
    }
  }, [scriptLoaded, onChange, onMapUrlChange]);

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
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Create a location string with coordinates
        const locationStr = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        
        // Update the state
        setInputValue(locationStr);
        
        // Generate a maps URL if handler provided
        if (onMapUrlChange) {
          const mapsUrl = generateGoogleMapsUrl(`${latitude},${longitude}`);
          onMapUrlChange(mapsUrl);
        }
        
        // Update with coordinates
        onChange(locationStr, latitude, longitude);
        
        toast({
          title: "Location Found",
          description: "Your current location has been added"
        });
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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || t('location.searchPlaceholder')}
          className="pl-8 pr-10"
        />
        {inputValue && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              if (placeDetails?.lat && placeDetails?.lng) {
                window.open(generateGoogleMapsUrl(`${placeDetails.lat},${placeDetails.lng}`), '_blank');
              } else if (inputValue) {
                window.open(generateGoogleMapsUrl(inputValue), '_blank');
              }
            }}
            title={t('location.viewOnMap')}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-xs"
        onClick={getCurrentLocation}
      >
        <Navigation className="h-3.5 w-3.5" />
        {t('location.currentLocation')}
      </Button>
    </div>
  );
};

export default LocationPickerComponent;
