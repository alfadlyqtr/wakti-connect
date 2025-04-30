
import React from "react";
import { Event } from "@/types/event.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import { CalendarDays, MapPin, Users } from "lucide-react";

interface EventGridProps {
  events: Event[];
}

export const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
        >
          <div 
            className="h-40 bg-cover bg-center"
            style={{
              backgroundImage: event.customization?.background?.value
                ? `url(${event.customization.background.value})`
                : 'linear-gradient(to right, #4F46E5, #7C3AED)'
            }}
          />
          <CardContent className="flex-grow p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDate(event.start_time)}</span>
              {event.is_all_day ? (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">All day</span>
              ) : (
                <span>{formatDate(event.end_time, 'time')}</span>
              )}
            </div>
            
            <h3 className="font-medium text-lg mb-2">{event.title}</h3>
            
            {event.description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {event.description}
              </p>
            )}
            
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>
                {event.invitations?.length ?? 0} {event.invitations?.length === 1 ? 'guest' : 'guests'}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-3 bg-muted/20 border-t">
            <Button variant="ghost" size="sm">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
