
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { isValidMapsUrl, formatLocation } from '@/utils/locationUtils';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation } from 'lucide-react';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
}

const LocationDialog = ({ open, onOpenChange, onLocationSelect }: LocationDialogProps) => {
  const [mapUrl, setMapUrl] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [activeTab, setActiveTab] = useState('maps');

  const handleAddMapsUrl = () => {
    if (!isValidMapsUrl(mapUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Maps URL",
        variant: "destructive"
      });
      return;
    }
    
    onLocationSelect(mapUrl, 'google_maps', mapUrl);
    onOpenChange(false);
    setMapUrl('');
  };
  
  const handleAddManualLocation = () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Empty location",
        description: "Please enter a location",
        variant: "destructive"
      });
      return;
    }
    
    onLocationSelect(manualLocation, 'manual');
    onOpenChange(false);
    setManualLocation('');
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (isValidMapsUrl(clipboardText)) {
        setMapUrl(clipboardText);
      } else {
        toast({
          title: "Not a Maps URL",
          description: "The clipboard content is not a valid Google Maps URL",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Clipboard access denied",
        description: "Please allow clipboard access or paste the URL manually",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Add Location</h2>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="maps">Google Maps</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="maps" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste a Google Maps link of any location
              </p>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Paste Google Maps link here"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handlePasteFromClipboard}
                  type="button"
                >
                  Paste
                </Button>
              </div>
              
              {mapUrl && isValidMapsUrl(mapUrl) && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Preview:</p>
                  <p className="text-sm mt-1">{formatLocation(mapUrl)}</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Examples of valid Google Maps URLs:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>https://goo.gl/maps/abcXYZ</li>
                  <li>https://maps.app.goo.gl/abcXYZ</li>
                  <li>https://www.google.com/maps/place/...</li>
                </ul>
              </div>
              
              <Button 
                type="button" 
                className="w-full"
                onClick={handleAddMapsUrl}
                disabled={!mapUrl.trim() || !isValidMapsUrl(mapUrl)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manualLocation">Location Name or Address</Label>
                <Input 
                  id="manualLocation"
                  placeholder="E.g. Eiffel Tower or 123 Main St, City"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter any location name or full address
                </p>
              </div>
              
              <Button
                type="button"
                className="w-full"
                onClick={handleAddManualLocation}
                disabled={!manualLocation.trim()}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Add Manual Location
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
