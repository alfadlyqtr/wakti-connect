
import { useState } from "react";
import { generateGoogleMapsUrl } from "@/config/maps";
import { toast } from "@/components/ui/use-toast";

export function useEventLocation() {
  const [location, setLocation] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
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
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsGettingLocation(true);
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });
      
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.status === "REQUEST_DENIED") {
          console.error("Google Maps API request denied:", data.error_message);
          toast({
            title: "API Error",
            description: "Unable to get address from your location. Using coordinates instead.",
            variant: "destructive"
          });
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationType('manual');
          setMapsUrl(generateGoogleMapsUrl(`${latitude},${longitude}`));
        } else if (data.results && data.results[0]) {
          setLocation(data.results[0].formatted_address);
          setLocationType('google_maps');
          setMapsUrl(generateGoogleMapsUrl(`${latitude},${longitude}`));
        } else {
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationType('manual');
          setMapsUrl(generateGoogleMapsUrl(`${latitude},${longitude}`));
        }
      } catch (error) {
        console.error("Error getting address from coordinates:", error);
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocationType('manual');
        setMapsUrl(generateGoogleMapsUrl(`${latitude},${longitude}`));
      }
      
      return true;
    } catch (err) {
      console.error("Error getting current location:", err);
      setError("Failed to get your current location");
      toast({
        title: "Error",
        description: "Failed to get your current location",
        variant: "destructive"
      });
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
    error,
    updateLocation,
    handleLocationChange,
    handleCoordinatesChange,
    getCurrentLocation,
    setMapsUrl,
    generateMapUrl: generateGoogleMapsUrl
  };
}
