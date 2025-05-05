
import React from 'react';
import { CalendarEvent } from '@/types/calendar.types';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface CalendarEventListProps {
  events: CalendarEvent[];
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No events found</div>;
  }

  // Helper function to get the color class based on event type
  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task':
        return 'bg-amber-500';
      case 'booking':
        return 'bg-green-500';
      case 'event':
        return 'bg-blue-500';
      case 'manual':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      {events.map(event => (
        <div 
          key={event.id} 
          className="p-3 rounded-lg border bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className={`h-3 w-3 rounded-full mt-1.5 ${getEventTypeColor(event.type)}`} />
            <div className="flex-1">
              <h4 className="font-medium text-base">{event.title}</h4>
              
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{format(new Date(event.date), 'h:mm a')}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarEventList;
