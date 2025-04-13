
import { useState } from "react";
import { generateGoogleMapsUrl } from "@/config/maps";

export function useEventLocation() {
  const [location, setLocation] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = (newLocation: string | null, type: 'manual' | 'google_maps' = 'manual', url?: string) => {
    setLocation(newLocation);
    setLocationType(type);
    
    if (newLocation) {
      if (type === 'google_maps' && url) {
        setMapsUrl(url);
      } else {
        setMapsUrl(generateGoogleMapsUrl(newLocation));
      }
    } else {
      setMapsUrl(null);
    }
  };
  
  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };
  
  const getCurrentLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return false;
    }
    
    try {
      setIsGettingLocation(true);
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });
      
      // Use Reverse Geocoding to get address from coordinates
      // This would be a real implementation, but for this example, we'll just set a placeholder
      setLocation("Current Location");
      setLocationType('manual');
      setMapsUrl(generateGoogleMapsUrl(`${latitude},${longitude}`));
      
      return true;
    } catch (err) {
      console.error("Error getting current location:", err);
      setError("Failed to get your current location");
      return false;
    } finally {
      setIsGettingLocation(false);
    }
  };
  
  const updateLocation = (newLocation: string | null) => {
    handleLocationChange(newLocation, 'manual');
  };
  
  return {
    location,
    locationType,
    mapsUrl,
    coordinates,
    isGettingLocation,
    isLoading,
    error,
    updateLocation,
    handleLocationChange,
    handleCoordinatesChange,
    getCurrentLocation,
    setMapsUrl,
    generateMapUrl: generateGoogleMapsUrl
  };
}
