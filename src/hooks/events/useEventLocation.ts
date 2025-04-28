
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
    displayLocation: string,
    newMapsUrl?: string,
    lat?: number,
    lng?: number
  ) => {
    setLocation(displayLocation);
    
    if (newMapsUrl?.includes('google.com/maps')) {
      setLocationType('google_maps');
      setMapsUrl(newMapsUrl);
    } else {
      setLocationType('manual');
      setMapsUrl('');
    }
    
    if (lat && lng) {
      setCoordinates({ lat, lng });
    } else {
      setCoordinates(null);
    }
  }, []);

  return {
    location,
    locationType,
    mapsUrl,
    coordinates,
    handleLocationChange,
    isGettingLocation,
    setMapsUrl
  };
};
