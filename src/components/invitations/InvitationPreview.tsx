
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Clock, CalendarDays } from 'lucide-react';
import { generateMapsUrl } from '@/utils/locationUtils';
import EventInvitationResponse from '@/components/events/EventInvitationResponse';
import { createGoogleCalendarUrl, createICSFile } from '@/utils/calendarUtils';

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

  const handleAddToCalendar = () => {
    if (!date) return;
    
    // Create a calendar event for the invitation
    const eventDate = date ? new Date(date) : new Date();
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      eventDate.setHours(hours || 0, minutes || 0);
    }
    
    // End time is 1 hour after start time by default
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const eventDetails = {
      title: title,
      description: description || '',
      location: location || '',
      start: eventDate,
      end: endDate,
    };
    
    // Open Google Calendar in a new tab
    window.open(createGoogleCalendarUrl(eventDetails), '_blank');
  };

  return (
    <Card 
      className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in border border-white/10 backdrop-blur-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] dark:hover:shadow-[0_12px_40px_rgba(120,120,255,0.25)] transform hover:-translate-y-2 w-full max-w-2xl mx-auto"
      style={cardStyle}
    >
      <CardHeader className="pb-3">
        <h3 className="text-2xl font-semibold text-shadow-md">{title}</h3>
        {date && (
          <div className="flex items-center text-sm space-x-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-shadow-xs">{date}</span>
            {time && (
              <div className="flex items-center ml-2">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-shadow-xs">{time}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-4">
        {description && (
          <p className="text-md mb-5 text-shadow-sm leading-relaxed">{description}</p>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-3">
            <Map className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate text-shadow-xs">
              {locationTitle || location}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-4 p-6">
        {/* Only show the response buttons if this is an event and we have an eventId */}
        {isEvent && eventId && showActions && (
          <EventInvitationResponse 
            eventId={eventId} 
            eventTitle={title} 
            className="w-full"
          />
        )}

        <div className="flex flex-col sm:flex-row w-full gap-3">
          {date && showActions && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddToCalendar}
              className="flex-1 bg-blue-500/40 hover:bg-blue-600/60 text-white font-medium py-3 h-12 rounded-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Add to Calendar</span>
            </Button>
          )}
        
          {hasLocation && location && showActions && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(generateMapsUrl(location), '_blank')}
              className="flex-1 bg-blue-500/40 hover:bg-blue-600/60 text-white font-medium py-3 h-12 rounded-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Map className="h-4 w-4" />
              <span>Get Directions</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvitationPreview;
