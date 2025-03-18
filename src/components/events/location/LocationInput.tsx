
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    /^https?:\/\/goo\.gl\/maps/,
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
            <Input
              disabled={locationType !== 'manual'}
              value={locationType === 'manual' ? location : ''}
              onChange={(e) => onLocationChange(e.target.value, 'manual')}
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
              Paste a Google Maps location link
            </p>
            <div className="space-y-3">
              <Input
                disabled={locationType !== 'google_maps'}
                value={mapUrl}
                onChange={(e) => handleMapUrlChange(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full"
              />
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
