
import React from 'react';
import { Map, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { generateTomTomMapsUrl } from '@/config/maps';

interface DialogHeaderProps {
  title: string;
  location?: string | null;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ title, location }) => {
  const showMapButton = location && location.length > 0;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      {showMapButton && (
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Map className="h-3.5 w-3.5 mr-1 text-green-600" />
          <span className="mr-2">{location}</span>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-green-600 flex items-center gap-1"
            onClick={() => location && window.open(generateTomTomMapsUrl(location), '_blank')}
          >
            <span className="text-xs">View on Map</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );
};
