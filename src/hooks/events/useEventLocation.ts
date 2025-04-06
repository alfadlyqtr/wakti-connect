
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateGoogleMapsUrl } from "@/config/maps";

export const useEventLocation = () => {
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [coordinates, setCoordinates] = useState<{latitude?: number, longitude?: number}>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const handleLocationChange = useCallback((value: string, type: 'manual' | 'google_maps' = 'manual', url?: string) => {
    setLocation(value);
    setLocationType(type);
    if (type === 'google_maps' && url) {
      setMapsUrl(url);
    } else if (type === 'manual') {
      setMapsUrl('');
    }
  }, []);
  
  const handleCoordinatesChange = useCallback((lat?: number, lng?: number) => {
    if (lat && lng) {
      setCoordinates({ latitude: lat, longitude: lng });
      // Also update the maps URL based on these coordinates
      const newUrl = generateGoogleMapsUrl(`${lat},${lng}`);
      setMapsUrl(newUrl);
      return newUrl;
    }
    return '';
  }, []);
  
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Create a location string with coordinates
        const locationStr = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        
        // Update the state
        setLocation(locationStr);
        setLocationType('google_maps');
        setCoordinates({ latitude, longitude });
        
        // Generate and set the maps URL
        const newMapsUrl = generateGoogleMapsUrl(`${latitude},${longitude}`);
        setMapsUrl(newMapsUrl);
        
        toast({
          title: "Location Found",
          description: "Your current location has been added"
        });
        
        setIsGettingLocation(false);
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
        
        setIsGettingLocation(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return {
    location,
    locationType,
    mapsUrl,
    coordinates,
    isGettingLocation,
    handleLocationChange,
    handleCoordinatesChange,
    getCurrentLocation,
    setMapsUrl
  };
};
