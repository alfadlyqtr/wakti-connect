
import React from "react";
import { Event } from "@/types/event.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import { CalendarDays, MapPin, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventGridProps {
  events: Event[];
}

export const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  const navigate = useNavigate();

  const handleEditEvent = (event: Event) => {
    // Navigate to event edit page or open edit modal
    navigate(`/events/${event.id}/edit`);
  };

  const handleViewEvent = (event: Event) => {
    // Navigate to event details page
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-0">
            <div 
              className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500" 
              style={{
                backgroundImage: event.customization?.headerImage ? 
                  `url(${event.customization.headerImage})` : 
                  'linear-gradient(to right, #3b82f6, #6366f1)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <h3 
              className="font-medium text-lg mb-1 cursor-pointer" 
              onClick={() => handleViewEvent(event)}
            >
              {event.title}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <CalendarDays className="h-3 w-3 mr-1" />
              <span>{formatDate(event.start_time)}</span>
              {event.is_all_day && <span className="ml-1">(All day)</span>}
            </div>
            
            {event.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.description && (
              <p className="mt-2 text-sm line-clamp-2">{event.description}</p>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditEvent(event)}
              className="w-full mt-2"
            >
              <Edit className="h-3 w-3 mr-1" />
              Manage Event
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
