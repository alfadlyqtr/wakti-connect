
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { isValidMapsUrl } from '@/utils/locationUtils';
import LocationPicker from './LocationPicker';

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  location: string;
  locationTitle: string;
  onLocationChange: (location: string, locationTitle: string) => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onClose,
  location,
  locationTitle,
  onLocationChange
}) => {
  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <LocationPicker
            location={location}
            locationTitle={locationTitle}
            onLocationChange={onLocationChange}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
