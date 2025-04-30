
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from 'lucide-react';
import LocationPicker from './LocationPicker';

interface LocationInputProps {
  location: string;
  locationTitle: string;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  onChange: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  location,
  locationTitle,
  locationType = 'manual',
  mapsUrl,
  onChange,
  getCurrentLocation,
  isGettingLocation = false
}) => {
  const [activeTab, setActiveTab] = useState<string>(locationType || 'manual');
  
  const handleMapsLocation = (newLocation: string, newTitle: string) => {
    onChange(newLocation, 'google_maps', newLocation, newTitle);
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="manual"
            onClick={() => onChange(location, 'manual', undefined, locationTitle)}
          >
            Manual Entry
          </TabsTrigger>
          <TabsTrigger 
            value="google_maps"
            onClick={() => onChange(mapsUrl || '', 'google_maps', mapsUrl, locationTitle)}
          >
            Google Maps
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          {/* Simple location input */}
          <div className="space-y-2">
            <Label htmlFor="location">Event Location</Label>
            <div className="flex space-x-2">
              <input 
                id="location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter location"
                value={location}
                onChange={(e) => onChange(e.target.value, 'manual', undefined, locationTitle)}
              />
              {getCurrentLocation && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="whitespace-nowrap"
                  disabled={isGettingLocation}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {isGettingLocation ? 'Getting...' : 'Current Location'}
                </Button>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="location-title">Location Title (Optional)</Label>
              <input 
                id="location-title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., Conference Room A, Building 5"
                value={locationTitle}
                onChange={(e) => onChange(location, 'manual', undefined, e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="google_maps">
          <LocationPicker 
            location={mapsUrl || ''}
            locationTitle={locationTitle}
            onLocationChange={handleMapsLocation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationInput;
