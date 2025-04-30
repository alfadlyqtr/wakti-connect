
import React from "react";
import { Event } from "@/types/event.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/utils/dateUtils";
import { formatLocation } from "@/utils/locationUtils";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventListProps {
  events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div 
                className="w-full h-24 md:w-48 bg-cover bg-center"
                style={{
                  backgroundImage: event.customization?.background?.value
                    ? `url(${event.customization.background.value})`
                    : 'linear-gradient(to right, #4F46E5, #7C3AED)'
                }}
              />
              <div className="p-4 flex-grow">
                <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  <span>{formatDate(event.start_time)}</span>
                  {event.is_all_day ? (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">All day</span>
                  ) : (
                    <span>{formatDate(event.end_time, 'time')}</span>
                  )}
                </div>
                
                <h3 className="font-medium mb-1">{event.title}</h3>
                
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{formatLocation(event.location)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>
                    {event.invitations?.length ?? 0} {event.invitations?.length === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-2 bg-muted/20">
            <Button variant="ghost" size="sm">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
