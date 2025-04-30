
import React from 'react';
import { useCustomization } from '../context';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import LivePreview from '../LivePreview';

interface EventCardPreviewProps {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  locationTitle?: string;
}

const EventCardPreview: React.FC<EventCardPreviewProps> = ({
  title = "My Amazing Event",
  description = "Join us for an unforgettable event. Add more details about what to expect and any special instructions for attendees.",
  date = new Date(),
  location = "123 Main St, Anytown, USA",
  locationTitle
}) => {
  const { customization } = useCustomization();
  
  // Format the date for preview
  const formattedDate = date ? format(date, "MMMM d, yyyy • h:mm a") : "Date & Time TBD";
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      
      <Card className="overflow-hidden shadow-lg relative">
        <CardContent className="p-0">
          <LivePreview 
            customization={customization}
            title={title}
            description={description}
            date={formattedDate}
            location={location}
            locationTitle={locationTitle}
          />
        </CardContent>
      </Card>
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Card Dimensions</h4>
        <p className="text-xs text-muted-foreground">5.78" × 2.82" (146.7mm × 71.5mm)</p>
        <p className="text-xs text-muted-foreground mt-1">Preview is shown at actual size</p>
      </div>
    </div>
  );
};

export default EventCardPreview;
