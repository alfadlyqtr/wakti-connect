
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LocationPicker from './LocationPicker';
import { generateGoogleMapsUrl, isValidMapsUrl } from '@/config/maps';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationInputProps {
  locationType: 'manual' | 'google_maps';
  location: string;
  mapsUrl?: string;
  onLocationChange: (value: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  locationType,
  location,
  mapsUrl,
  onLocationChange,
}) => {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string>(mapsUrl || '');
  const [isLocating, setIsLocating] = useState(false);
  
  const handleMapUrlChange = (url: string) => {
    setMapUrl(url);
    
    if (url && !isValidMapsUrl(url)) {
      setUrlError('Please enter a valid Google Maps URL');
    } else {
      setUrlError(null);
      onLocationChange(location, 'google_maps', url);
    }
  };
  
  const handlePreviewMap = () => {
    if (mapUrl && isValidMapsUrl(mapUrl)) {
      window.open(mapUrl, '_blank');
    }
  };

  const handleLocationPickerChange = (value: string, lat?: number, lng?: number) => {
    if (locationType === 'manual') {
      onLocationChange(value, 'manual');
    } else {
      const newMapsUrl = lat && lng 
        ? generateGoogleMapsUrl(`${lat},${lng}`)
        : generateGoogleMapsUrl(value);
      
      setMapUrl(newMapsUrl);
      onLocationChange(value, 'google_maps', newMapsUrl);
    }
  };
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const mapsUrl = generateGoogleMapsUrl(locationStr);
        
        setMapUrl(mapsUrl);
        onLocationChange(locationStr, 'google_maps', mapsUrl);
        
        toast({
          title: "Location Found",
          description: "Your current location has been added"
        });
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <RadioGroup 
        value={locationType} 
        onValueChange={(value) => onLocationChange(location, value as 'manual' | 'google_maps', mapUrl)}
        className="grid grid-cols-2 gap-2"
      >
        <div className="flex flex-col items-center space-y-1 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="manual" id="manual-location" className="sr-only" />
          <MapPin className="h-5 w-5 text-primary" />
          <Label htmlFor="manual-location" className="text-sm font-medium cursor-pointer">
            Manual Location
          </Label>
        </div>
        <div className="flex flex-col items-center space-y-1 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="google_maps" id="google-maps" className="sr-only" />
          <ExternalLink className="h-5 w-5 text-primary" />
          <Label htmlFor="google-maps" className="text-sm font-medium cursor-pointer">
            Map
          </Label>
        </div>
      </RadioGroup>

      <div className="space-y-4 pt-2 border-t">
        {locationType === 'manual' ? (
          <div className="space-y-2">
            <Label htmlFor="manual-location-input">Enter Location</Label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                id="manual-location-input"
                value={location}
                onChange={(e) => onLocationChange(e.target.value, 'manual')}
                placeholder="Enter location manually (e.g., 123 Main St, City)"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search for a location</Label>
              <LocationPicker
                value={location}
                onChange={(value, lat, lng) => handleLocationPickerChange(value, lat, lng)}
                placeholder="Search for a location or place"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={getCurrentLocation}
                disabled={isLocating}
              >
                <Navigation className="mr-2 h-4 w-4" />
                {isLocating ? "Getting location..." : "Use current location"}
              </Button>
              
              {mapUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={handlePreviewMap}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View on Map</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maps-url">Map URL (Optional)</Label>
              <Input
                id="maps-url"
                value={mapUrl}
                onChange={(e) => handleMapUrlChange(e.target.value)}
                placeholder="https://www.google.com/maps/..."
                className="pr-9"
              />
              
              {urlError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">{urlError}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-display-name">Location Display Name</Label>
              <Input
                id="location-display-name"
                value={location}
                onChange={(e) => onLocationChange(e.target.value, 'google_maps', mapUrl)}
                placeholder="Enter a friendly name for this location"
              />
              <p className="text-xs text-muted-foreground">This is what attendees will see as the location</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInput;
