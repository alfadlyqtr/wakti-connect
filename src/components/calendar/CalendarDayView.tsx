
import React from "react";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types/calendar.types";
import { CalendarEventItem } from "./CalendarEventItem";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { groupBy } from "lodash";

interface CalendarDayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isSummary?: boolean;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  selectedDate,
  events,
  isSummary = false
}) => {
  // Group events by type
  const eventsByType = groupBy(events, 'type');
  
  // Order of event types to display
  const eventTypeOrder = ['booking', 'event', 'task', 'manual'];
  
  // Display names for event types
  const eventTypeNames = {
    booking: 'Bookings',
    event: 'Events',
    task: 'Tasks',
    manual: 'Manual Entries'
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events scheduled for {format(selectedDate, "MMMM d, yyyy")}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isSummary ? 'max-h-[200px]' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">
          {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        <Badge variant="outline" className="ml-2 bg-white/50 text-xs">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </Badge>
      </div>

      <ScrollArea className={isSummary ? 'h-[200px]' : 'h-full'}>
        <div className="space-y-4">
          {eventTypeOrder.map(type => {
            const typeEvents = eventsByType[type] || [];
            if (typeEvents.length === 0) return null;
            
            return (
              <div key={type} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {eventTypeNames[type]} ({typeEvents.length})
                </h4>
                
                <div className="space-y-1">
                  {typeEvents.map(event => (
                    <CalendarEventItem 
                      key={event.id} 
                      event={event} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
