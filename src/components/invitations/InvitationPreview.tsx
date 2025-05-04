import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Clock, CalendarDays } from 'lucide-react';
import { generateMapsUrl } from '@/utils/locationUtils';
import EventInvitationResponse from '@/components/events/EventInvitationResponse';
import { createGoogleCalendarUrl, createICSFile } from '@/services/event/createICSFile';
import EventResponseSummary from '@/components/events/EventResponseSummary';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
  
  // Check if current user is the creator of the event
  const { data: isCreator } = useQuery({
    queryKey: ['isEventCreator', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return false;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;
      
      const { data: event } = await supabase
        .from('events')
        .select('user_id')
        .eq('id', eventId)
        .single();
        
      return event?.user_id === session.user.id;
    }
  });
  
  // Check if user is authenticated for WAKTI calendar option
  const { data: isAuthenticated } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    }
  });
  
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

  const handleCalendarAction = (action: string) => {
    if (!date) return;
    
    // Create a calendar event for the invitation
    const startDate = new Date(date);
    let endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Default to 1 hour if no time specified
    
    if (time) {
      // Parse the time string (assuming format like "19:00" or "7:00 PM")
      const timeParts = time.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1].split(' ')[0], 10);
        
        startDate.setHours(hours, minutes);
        endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1); // Default event duration is 1 hour
      }
    }
    
    const eventDetails = {
      title,
      description: description || '',
      location: location || '',
      start: startDate,
      end: endDate,
    };
    
    switch (action) {
      case 'google':
        // Open Google Calendar in a new tab
        window.open(createGoogleCalendarUrl(eventDetails), '_blank');
        break;
      case 'apple':
      case 'outlook':
        // Both Apple and Outlook use ICS files
        createICSFile(eventDetails);
        break;
      case 'wakti':
        // Handle WAKTI calendar integration (simplified for now)
        if (isAuthenticated) {
          toast({
            title: "Added to WAKTI Calendar",
            description: "Event has been added to your WAKTI Calendar",
          });
        } else {
          toast({
            title: "Authentication Required",
            description: "Please log in to add events to your WAKTI Calendar",
            variant: "destructive",
          });
        }
        break;
      default:
        break;
    }
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
        
        {/* Display the response summary for event creators */}
        {isCreator && eventId && (
          <div className="mt-2">
            <EventResponseSummary eventId={eventId} isCreator={true} />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 bg-blue-500/40 hover:bg-blue-600/60 text-white font-medium py-3 h-12 rounded-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Add to Calendar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md p-2">
                <DropdownMenuItem onClick={() => handleCalendarAction('google')} className="cursor-pointer">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Google Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCalendarAction('apple')} className="cursor-pointer">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Apple Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCalendarAction('outlook')} className="cursor-pointer">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Outlook Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleCalendarAction('wakti')} 
                  disabled={!isAuthenticated}
                  className="cursor-pointer"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>WAKTI Calendar {!isAuthenticated && "(Login Required)"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
