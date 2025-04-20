
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useEventLocation = () => {
  const [location, setLocation] = useState<string>('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
          const newMapsUrl = `https://www.tomtom.com/en_gb/maps/view?lat=${lat}&lon=${lon}`;
          setMapsUrl(newMapsUrl);
        }
      } catch (error) {
        console.error('Error generating maps URL:', error);
      }
    }
  }, []);

  return {
    location,
    locationType,
    mapsUrl,
    handleLocationChange,
    isGettingLocation
  };
};
