
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Clock } from 'lucide-react';
import { generateMapsUrl } from '@/utils/locationUtils';
import { useCustomization } from '../context';
import { format } from 'date-fns';

interface EventCardPreviewProps {
  title?: string;
  description?: string;
  location?: string;
  locationTitle?: string;
  date?: Date;
}

const EventCardPreview: React.FC<EventCardPreviewProps> = ({ 
  title = "Event Title", 
  description = "Event description goes here. This is where you can add details about your event.", 
  location,
  locationTitle,
  date = new Date()
}) => {
  const { customization } = useCustomization();
  const hasLocation = !!location;
  
  // Generate background style with fallbacks for missing properties
  const cardStyle: React.CSSProperties = {
    color: customization.font?.color || '#000000',
  };
  
  if (customization.background?.type === 'solid') {
    cardStyle.backgroundColor = customization.background?.value || '#ffffff';
  } else if (customization.background?.type === 'image' && customization.background?.value) {
    cardStyle.backgroundImage = `url(${customization.background.value})`;
    cardStyle.backgroundSize = 'cover';
    cardStyle.backgroundPosition = 'center';
    cardStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Darken the image a bit
    cardStyle.color = '#ffffff'; // Default text color on images
  } else {
    // Fallback if background is missing
    cardStyle.backgroundColor = '#ffffff';
  }
  
  // Format dates for display
  const formattedDate = date ? format(date, 'MMM dd, yyyy') : '';
  const formattedTime = date ? format(date, 'h:mm a') : '';
  
  return (
    <Card className="overflow-hidden shadow-lg" style={cardStyle}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center text-sm space-x-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          {formattedTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mx-1" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-3">{description}</p>
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-2">
            <Map className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{locationTitle || location}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          {hasLocation && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs h-8"
            >
              Get Directions
            </Button>
          )}
        </div>
        
        {customization.showAddToCalendarButton !== false && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            Add to Calendar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCardPreview;
