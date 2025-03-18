
import { useState, useCallback } from "react";

export const useEventLocation = () => {
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  
  const handleLocationChange = useCallback((value: string, type: 'manual' | 'google_maps', url?: string) => {
    setLocation(value);
    setLocationType(type);
    if (type === 'google_maps' && url) {
      setMapsUrl(url);
    } else {
      setMapsUrl('');
    }
  }, []);

  return {
    location,
    locationType,
    mapsUrl,
    handleLocationChange
  };
};
