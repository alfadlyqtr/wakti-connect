
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
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
  const [inputValue, setInputValue] = useState(value);

  // Update local state when prop value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
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

      const { latitude, longitude } = position.coords;
      
      // Format location as coordinates with reasonable precision
      const locationString = `Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
      setInputValue(locationString);
      onChange(locationString, latitude, longitude);
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: getGeolocationErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to get a readable error message for geolocation errors
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
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || "Enter a location"}
          className="w-full"
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
