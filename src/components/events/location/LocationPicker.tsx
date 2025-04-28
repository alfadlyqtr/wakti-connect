
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const { searchLocation, searchResults, isSearching } = useLocationSearch();

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    searchLocation(newValue);
    setOpen(true);
    onChange(newValue);
  };

  const handleSelectLocation = (displayName: string, lat: number, lon: number) => {
    setInputValue(displayName);
    onChange(displayName, lat, lon);
    setOpen(false);
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
      
      // Reverse geocode the coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      const locationString = data.display_name;
      
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder || "Search for a location"}
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        {searchResults.length > 0 && (
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandGroup>
                {searchResults.map((result, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelectLocation(result.display_name, result.lat, result.lon)}
                    className="px-4 py-2 cursor-pointer hover:bg-accent"
                  >
                    {result.display_name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {isSearching && (
                <div className="flex items-center justify-center p-2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
              {!isSearching && searchResults.length === 0 && (
                <CommandEmpty>No results found</CommandEmpty>
              )}
            </Command>
          </PopoverContent>
        )}
      </Popover>
      
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
