
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Clock } from 'lucide-react';
import { generateMapsUrl } from '@/utils/locationUtils';
import EventInvitationResponse from '@/components/events/EventInvitationResponse';

interface InvitationPreviewProps {
  title: string;
  description?: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  customization?: any;
  isEvent?: boolean;
  showActions?: boolean;
  eventId?: string; // Add eventId for the response buttons
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  title,
  description,
  location,
  locationTitle,
  date,
  time,
  customization = {},
  isEvent = false,
  showActions = true,
  eventId,
}) => {
  // Generate background style from customization
  const cardStyle: React.CSSProperties = {};
  const hasLocation = !!location;
  
  if (customization?.background) {
    const background = customization.background;
    
    if (background.type === 'solid') {
      cardStyle.backgroundColor = background.value;
    } else if (background.type === 'image' && background.value) {
      cardStyle.backgroundImage = `url(${background.value})`;
      cardStyle.backgroundSize = 'cover';
      cardStyle.backgroundPosition = 'center';
      cardStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
  }
  
  if (customization?.font?.color) {
    cardStyle.color = customization.font.color;
  }

  return (
    <Card className="overflow-hidden shadow-lg" style={cardStyle}>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {date && (
          <div className="flex items-center text-sm space-x-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
            {time && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mx-1" />
                <span>{time}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {description && (
          <p className="text-sm mb-3">{description}</p>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-2">
            <Map className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {locationTitle || location}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-4">
        {/* Only show the response buttons if this is an event and we have an eventId */}
        {isEvent && eventId && showActions && (
          <EventInvitationResponse 
            eventId={eventId} 
            eventTitle={title} 
            className="w-full"
          />
        )}
        
        {hasLocation && location && showActions && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(generateMapsUrl(location), '_blank')}
            className="w-full text-xs h-8"
          >
            Get Directions
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvitationPreview;
