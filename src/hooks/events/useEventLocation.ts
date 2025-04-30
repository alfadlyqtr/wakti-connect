
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateMapsUrl } from "@/utils/locationUtils";

export const useEventLocation = () => {
  const [location, setLocation] = useState<string>('');
  const [locationTitle, setLocationTitle] = useState<string>('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  // Advanced location change handler with consistent parameter types
  const handleLocationChange = useCallback((
    newLocation: string, 
    type?: 'manual' | 'google_maps',
    url?: string,
    title?: string
  ) => {
    setLocation(newLocation);
    
    // Update location title if provided
    if (title !== undefined) {
      setLocationTitle(title);
    }
    
    // Update location type
    if (type) {
      setLocationType(type);
    } else if (url?.includes('google.com/maps')) {
      setLocationType('google_maps');
    } else if (newLocation) {
      setLocationType('manual');
    }
    
    // Update maps URL
    if (url) {
      setMapsUrl(url);
    } else if (newLocation) {
      // Generate a default maps URL if we have a location
      setMapsUrl(generateMapsUrl(newLocation));
    } else {
      setMapsUrl('');
    }
    
    // Clear coordinates if location is cleared
    if (!newLocation) {
      setCoordinates(null);
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation unavailable",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          // Try to get a readable address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data && data.display_name) {
              const formattedLocation = data.display_name;
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              
              handleLocationChange(
                formattedLocation, 
                'google_maps', 
                googleMapsUrl,
                locationTitle
              );
              
              toast({
                title: "Location updated",
                description: "Successfully retrieved your current location",
              });
            } else {
              throw new Error("Couldn't decode location");
            }
          } else {
            throw new Error("Error fetching location info");
          }
        } catch (error) {
          console.error("Error getting location:", error);
          
          // Fallback to coordinates if we can't get a readable address
          if (coordinates) {
            const { lat, lng } = coordinates;
            const coordsString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            
            handleLocationChange(
              coordsString,
              'google_maps',
              googleMapsUrl,
              locationTitle
            );
            
            toast({
              title: "Basic location set",
              description: "Using coordinates as we couldn't get a full address",
            });
          } else {
            toast({
              title: "Location error",
              description: "Could not determine your current location",
              variant: "destructive"
            });
          }
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
        
        let errorMessage = "Could not access your location";
        
        switch (error.code) {
          case 1:
            errorMessage = "Location access denied. Please enable it in your browser settings.";
            break;
          case 2:
            errorMessage = "Location unavailable. Please try again.";
            break;
          case 3:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [coordinates, handleLocationChange, locationTitle]);

  return {
    location,
    locationTitle,
    locationType,
    mapsUrl,
    coordinates,
    isGettingLocation,
    handleLocationChange,
    getCurrentLocation
  };
};
