
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Link as LinkIcon, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LocationPicker from './LocationPicker';
import { generateGoogleMapsUrl } from '@/config/maps';
import { toast } from '@/components/ui/toast';

interface LocationInputProps {
  locationType: 'manual' | 'google_maps';
  location: string;
  mapsUrl?: string;
  onLocationChange: (value: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
}

function isValidGoogleMapsUrl(url: string): boolean {
  // Check for various valid Google Maps URL formats
  const googleMapsPatterns = [
    // Standard maps.google.com format
    /^https?:\/\/(www\.)?maps\.google\.com/,
    // Standard google.com/maps format
    /^https?:\/\/(www\.)?google\.com\/maps/,
    // Short URL format (goo.gl)
    /^https?:\/\/goo\.gl\/maps\//,
    // Mobile app URL format
    /^https?:\/\/maps\.app\.goo\.gl\//,
    // Coordinate-based format
    /^https?:\/\/(www\.)?google\.com\/maps\/place\/[^\/]+\/@[-\d.]+,[-\d.]+/
  ];

  return googleMapsPatterns.some(pattern => pattern.test(url));
}

const LocationInput: React.FC<LocationInputProps> = ({
  locationType,
  location,
  mapsUrl,
  onLocationChange,
}) => {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string>(mapsUrl || '');
  const [mapCoordinates, setMapCoordinates] = useState<{lat?: number, lng?: number}>({});
  const [isLocating, setIsLocating] = useState(false);
  
  const handleMapUrlChange = (url: string) => {
    setMapUrl(url);
    
    if (url && !isValidGoogleMapsUrl(url)) {
      setUrlError('Please enter a valid Google Maps URL');
    } else {
      setUrlError(null);
      onLocationChange(location, 'google_maps', url);
    }
  };
  
  const handlePreviewMap = () => {
    if (mapUrl && isValidGoogleMapsUrl(mapUrl)) {
      window.open(mapUrl, '_blank');
    }
  };

  const handleLocationPickerChange = (value: string, lat?: number, lng?: number) => {
    setMapCoordinates({ lat, lng });
    if (locationType === 'manual') {
      onLocationChange(value, 'manual');
    } else {
      // For Google Maps type, generate a maps URL if we have coordinates
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
        
        // Create a location string with coordinates
        const locationStr = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        
        // Generate a Google Maps URL for the coordinates
        const mapsUrl = generateGoogleMapsUrl(`${latitude},${longitude}`);
        
        // Update the location and URL
        setMapCoordinates({ lat: latitude, lng: longitude });
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
        className="flex flex-col space-y-1"
      >
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
          <RadioGroupItem value="manual" id="manual-location" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="manual-location" className="text-base font-medium">
              Manual Location
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Enter a physical address or location name
            </p>
            <LocationPicker
              value={locationType === 'manual' ? location : ''}
              onChange={(value) => handleLocationPickerChange(value)}
              placeholder="123 Main St, City, Country"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
          <RadioGroupItem value="google_maps" id="google-maps" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="google-maps" className="text-base font-medium">
              Google Maps Link
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select a location, share your current location, or paste a Google Maps link
            </p>
            <div className="space-y-3">
              {locationType === 'google_maps' && (
                <>
                  <LocationPicker
                    value={location}
                    onChange={(value, lat, lng) => handleLocationPickerChange(value, lat, lng)}
                    placeholder="Search for a location"
                    className="w-full mb-2"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    {isLocating ? "Getting your location..." : "Share Current Location"}
                  </Button>
                </>
              )}
              
              <div className="relative">
                <Input
                  value={mapUrl}
                  onChange={(e) => handleMapUrlChange(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full pr-10"
                />
                {mapUrl && !urlError && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={handlePreviewMap}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Supported formats: maps.google.com, google.com/maps, goo.gl/maps, maps.app.goo.gl
              </p>
              {urlError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{urlError}</AlertDescription>
                </Alert>
              )}
              {locationType === 'google_maps' && mapUrl && !urlError && (
                <div>
                  <Label htmlFor="location-name" className="text-sm mb-1 block">
                    Location Name (visible to attendees)
                  </Label>
                  <Input
                    id="location-name"
                    value={location}
                    onChange={(e) => onLocationChange(e.target.value, 'google_maps', mapUrl)}
                    placeholder="Enter a friendly location name"
                    className="w-full"
                  />
                </div>
              )}
              {locationType === 'google_maps' && mapUrl && !urlError && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewMap}
                  className="mt-2"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Preview Map
                </Button>
              )}
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default LocationInput;
