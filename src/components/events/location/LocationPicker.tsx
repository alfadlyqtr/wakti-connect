import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Navigation } from 'lucide-react';
import { TOMTOM_API_KEY, generateTomTomMapsUrl } from '@/config/maps';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Add TypeScript types for TomTom Maps
declare global {
  interface Window {
    tomtom: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: any
          ) => tomtom.maps.places.Autocomplete;
        };
        Map: any;
      };
    };
  }
}

// Define the minimal TomTom Maps types we need
namespace tomtom.maps.places {
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
      place_id?: string;
      url?: string;
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

  // Simplify the component to not depend on Google Maps JS API
  // Instead, use TomTom Geocoding via our edge function
  
  const handleSearch = async () => {
    if (!inputValue) return;
    
    setIsSearching(true);
    try {
      // Call our TomTom geocode edge function
      const { data, error } = await supabase.functions.invoke('tomtom-geocode', {
        body: { query: inputValue }
      });
      
      if (error) {
        throw new Error(`Geocoding error: ${error.message}`);
      }
      
      if (data?.coordinates) {
        const { lat, lon } = data.coordinates;
        
        // Create place details object
        const placeData = {
          name: inputValue,
          address: inputValue,
          lat: lat,
          lng: lon,
          url: `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lon}`
        };
        
        setPlaceDetails(placeData);
        
        // Pass back location and coordinates
        onChange(inputValue, lat, lon);
        
        // Generate a TomTom maps URL and pass it back if handler provided
        if (onMapUrlChange) {
          const mapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lon}`;
          onMapUrlChange(mapsUrl);
        }
      } else {
        toast({
          title: "Location Error",
          description: "Could not find coordinates for this location",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Location Error",
        description: error instanceof Error ? error.message : "Failed to search location",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

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
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
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
        setPlaceDetails({
          name: locationStr,
          lat: latitude,
          lng: longitude
        });
        
        // Generate a maps URL if handler provided
        if (onMapUrlChange) {
          const mapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${latitude}&lon=${longitude}`;
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
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('location.searchPlaceholder')}
          className="pl-8 pr-10"
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
          onClick={handleSearch}
          disabled={isSearching || !inputValue}
        >
          {isSearching ? "..." : "Search"}
        </Button>
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
