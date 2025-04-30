
import React from "react";
import { Event } from "@/types/event.types";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Edit, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventListProps {
  events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  const navigate = useNavigate();

  const handleEditEvent = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    navigate(`/events/${event.id}/edit`);
  };

  const handleViewEvent = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="hover:shadow-sm transition-shadow cursor-pointer"
          onClick={() => handleViewEvent(event)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                
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
                  <p className="mt-2 text-sm line-clamp-1">{event.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => handleEditEvent(e, event)}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Manage
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
