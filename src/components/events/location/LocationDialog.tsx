
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
}

const LocationDialog = ({ open, onOpenChange, onLocationSelect }: LocationDialogProps) => {
  const [mapUrl, setMapUrl] = useState('');

  const handleAdd = () => {
    if (!mapUrl.includes('google.com/maps')) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Add Location</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a Google Maps link to add a location
            </p>
          </div>
          
          <Input
            placeholder="Paste Google Maps link here"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            className="w-full"
          />

          <Button 
            type="button" 
            className="w-full"
            onClick={handleAdd}
          >
            Add Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
