import { useState } from "react";
import { generateGoogleMapsUrl } from "@/config/maps";

export function useEventLocation() {
  const [location, setLocation] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = (newLocation: string | null) => {
    setLocation(newLocation);
    if (newLocation) {
      setMapUrl(generateGoogleMapsUrl(newLocation));
    } else {
      setMapUrl(null);
    }
  };
  
  return {
    location,
    mapUrl,
    isLoading,
    error,
    updateLocation,
    generateMapUrl: generateGoogleMapsUrl
  };
}
