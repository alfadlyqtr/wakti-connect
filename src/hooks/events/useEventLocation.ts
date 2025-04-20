
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
      try {
        const { data, error } = await supabase.functions.invoke('tomtom-geocode', {
          body: { query: newLocation }
        });

        if (error) {
          console.error('Error getting coordinates:', error);
          toast({
            title: "Location Error",
            description: "Could not get location coordinates. Using text only.",
            variant: "destructive"
          });
          return;
        }

        if (data?.coordinates) {
          const { lat, lon } = data.coordinates;
          setCoordinates({ lat, lng: lon });
          const newMapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lon}`;
          setMapsUrl(newMapsUrl);
        }
      } catch (error) {
        console.error('Error generating maps URL:', error);
      }
    }
  }, []);

  const handleCoordinatesChange = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    const newMapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lng}`;
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
        const mapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${latitude}&lon=${longitude}`;
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
