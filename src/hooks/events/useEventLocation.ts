
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateGoogleMapsUrl } from "@/config/maps";

export const useEventLocation = () => {
  const [location, setLocation] = useState<string>('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [displayLocation, setDisplayLocation] = useState<string>('');

  const formatLocationDisplay = (lat: number, lng: number): string => {
    const truncatedLat = lat.toFixed(3);
    const truncatedLng = lng.toFixed(3);
    return `Current Location (${truncatedLat}, ${truncatedLng})`;
  };

  const handleLocationChange = useCallback((
    displayLocation: string,
    mapsUrl?: string,
    lat?: number,
    lng?: number
  ) => {
    setLocation(displayLocation);
    setDisplayLocation(displayLocation);
    
    if (mapsUrl?.includes('google.com/maps')) {
      setLocationType('google_maps');
      setMapsUrl(mapsUrl);
    } else {
      setLocationType('manual');
      setMapsUrl('');
    }
    
    if (lat !== undefined && lng !== undefined) {
      setCoordinates({ lat, lng });
    } else {
      setCoordinates(null);
    }
  }, []);

  return {
    location,
    displayLocation,
    locationType,
    mapsUrl,
    coordinates,
    handleLocationChange,
    isGettingLocation,
    setMapsUrl,
    formatLocationDisplay
  };
};
