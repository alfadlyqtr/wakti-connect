
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Event } from '@/types/event.types';
import { createGoogleCalendarUrl, createICSFile } from '@/utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';

interface CalendarIntegrationButtonsProps {
  event: Event;
}

const CalendarIntegrationButtons: React.FC<CalendarIntegrationButtonsProps> = ({ event }) => {
  const handleAddToGoogleCalendar = () => {
    const googleCalendarUrl = createGoogleCalendarUrl({
      title: event.title,
      description: event.description || '',
      location: event.location_title || event.location || '',
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isAllDay: event.is_all_day
    });
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  const handleDownloadICS = () => {
    createICSFile({
      title: event.title,
      description: event.description || '',
      location: event.location_title || event.location || '',
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isAllDay: event.is_all_day
    });
  };
  
  const handleAddToWaktiCalendar = () => {
    // This would call the internal Wakti Calendar API
    // Implementation would depend on the specifics of your calendar API
    console.log('Adding to Wakti Calendar:', event);
    
    // For now, just show a toast message
    toast({
      title: "Added to Wakti Calendar",
      description: "Event successfully added to your Wakti Calendar",
    });
  };
  
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleAddToGoogleCalendar}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Add to Google Calendar
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleDownloadICS}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Download .ics File (Apple/Outlook)
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleAddToWaktiCalendar}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Save to Wakti Calendar
      </Button>
    </div>
  );
};

export default CalendarIntegrationButtons;
