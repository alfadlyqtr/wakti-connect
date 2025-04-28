
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateMapsUrl } from '@/utils/locationUtils';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
}

const LocationDialog = ({ open, onOpenChange, onLocationSelect }: LocationDialogProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsGettingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const coordsStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      const mapsUrl = generateMapsUrl(coordsStr);
      
      onLocationSelect(coordsStr, 'google_maps', mapsUrl);
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        title: "Error",
        description: getGeolocationErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const mapsUrl = generateMapsUrl(searchQuery);
    onLocationSelect(searchQuery, 'manual', mapsUrl);
    onOpenChange(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <>
                <LoadingSpinner size="sm" />
                Getting your location...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                Use my current location
              </>
            )}
          </Button>

          {searchQuery && (
            <Button 
              type="button" 
              className="w-full"
              onClick={handleSearch}
            >
              Send
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
