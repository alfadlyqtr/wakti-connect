
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateGoogleMapsUrl } from "@/config/maps";

export const useEventLocation = () => {
  const [location, setLocation] = useState<string>('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  const handleLocationChange = useCallback(async (
    newLocation: string, 
    type: 'manual' | 'google_maps' = 'manual', 
    url?: string
  ) => {
    setLocation(newLocation);
    setLocationType(type);
    
    if (url) {
      setMapsUrl(url);
    } else if (newLocation && type === 'google_maps') {
      // Try to generate a maps URL from the location
      const newMapsUrl = generateGoogleMapsUrl(newLocation);
      setMapsUrl(newMapsUrl);
    }
  }, []);

  const handleCoordinatesChange = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    const newMapsUrl = generateGoogleMapsUrl(`${lat},${lng}`);
    setMapsUrl(newMapsUrl);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update coordinates
        setCoordinates({ lat: latitude, lng: longitude });
        
        // Create a location string with coordinates
        const locationStr = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        setLocation(locationStr);
        
        // Generate a maps URL
        const mapsUrl = generateGoogleMapsUrl(`${latitude},${longitude}`);
        setMapsUrl(mapsUrl);
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        toast({
          title: "Location Error",
          description: getGeolocationErrorMessage(error),
          variant: "destructive"
        });
        
        setIsGettingLocation(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

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

  return {
    location,
    locationType,
    mapsUrl,
    coordinates,
    handleLocationChange,
    handleCoordinatesChange,
    getCurrentLocation,
    isGettingLocation,
    setMapsUrl
  };
};
