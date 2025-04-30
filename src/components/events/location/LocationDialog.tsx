
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onOpenChange,
  onLocationSelect
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Select Location</DialogTitle>
        <div className="p-4">
          <p className="text-center text-muted-foreground">
            Location selection has been deprecated
          </p>
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 bg-primary text-white rounded" 
              onClick={() => {
                onLocationSelect('');
                onOpenChange(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
