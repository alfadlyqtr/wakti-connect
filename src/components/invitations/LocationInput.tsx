
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { generateMapsUrl } from "@/utils/locationUtils";

interface LocationInputProps {
  location: string;
  locationUrl: string;
  onLocationChange: (location: string) => void;
  onLocationUrlChange: (url: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  locationUrl,
  onLocationChange,
  onLocationUrlChange,
}) => {
  const [isAutoGenerating, setIsAutoGenerating] = useState(true);

  // Auto-generate Google Maps URL when location changes and auto-generation is enabled
  useEffect(() => {
    if (isAutoGenerating && location) {
      const mapsUrl = generateMapsUrl(location);
      onLocationUrlChange(mapsUrl);
    }
  }, [location, isAutoGenerating, onLocationUrlChange]);

  // Handle manual URL changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoGenerating(false);
    onLocationUrlChange(e.target.value);
  };

  // Reset to auto-generation
  const handleAutoGenerate = () => {
    setIsAutoGenerating(true);
    if (location) {
      const mapsUrl = generateMapsUrl(location);
      onLocationUrlChange(mapsUrl);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="font-medium">Location</Label>
      
      <div>
        <Label>Location Name/Address</Label>
        <Input
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Enter location (e.g., 123 Main St, New York, NY)"
          className="mt-1"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <Label>Location Link</Label>
          {!isAutoGenerating && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAutoGenerate} 
              type="button"
              className="text-xs h-7 px-2"
            >
              Auto-generate
            </Button>
          )}
        </div>
        <Input
          value={locationUrl}
          onChange={handleUrlChange}
          placeholder="Enter location URL (Google Maps link)"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          This will create a "Get Directions" button on your invitation
        </p>
      </div>
    </div>
  );
};
