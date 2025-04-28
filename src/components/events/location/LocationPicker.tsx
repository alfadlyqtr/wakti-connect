
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateGoogleMapsUrl } from '@/config/maps';

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
  placeholder
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Check if it's a Google Maps URL
    if (newValue.includes('google.com/maps')) {
      onChange(newValue, 'google_maps', newValue);
    } else {
      onChange(newValue, 'manual');
    }
  };

  const formatLocationDisplay = (lat: number, lng: number): string => {
    const truncatedLat = lat.toFixed(3);
    const truncatedLng = lng.toFixed(3);
    return `Current Location (${truncatedLat}, ${truncatedLng})`;
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
    
    setIsGettingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Create a user-friendly display text
      const displayLocation = formatLocationDisplay(latitude, longitude);
      const mapsUrl = generateGoogleMapsUrl(`${latitude},${longitude}`);
      
      setInputValue(displayLocation);
      onChange(displayLocation, 'google_maps', mapsUrl);
      
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: getGeolocationErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied. Please allow location access in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "Location request timed out.";
      default:
        return "An unknown error occurred while getting your location.";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter a location or paste a Google Maps link"}
        className="w-full"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-xs"
        onClick={handleGetCurrentLocation}
        disabled={isGettingLocation}
      >
        {isGettingLocation ? (
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
