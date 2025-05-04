
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
  eventId?: string;
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
    <Card 
      className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in border border-white/10 backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(120,120,255,0.15)]"
      style={cardStyle}
    >
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        {date && (
          <div className="flex items-center text-sm space-x-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
            {time && (
              <div className="flex items-center ml-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>{time}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-4">
        {description && (
          <p className="text-sm mb-4">{description}</p>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-3">
            <Map className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {locationTitle || location}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-4">
        {/* Debug info - uncommented for debugging */}
        <div className="text-xs opacity-50 mb-2">
          isEvent: {isEvent ? 'true' : 'false'}, 
          eventId: {eventId || 'none'}, 
          showActions: {showActions ? 'true' : 'false'}
        </div>
        
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
            className="w-full text-sm h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Map className="h-4 w-4" />
            <span>Get Directions</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvitationPreview;
