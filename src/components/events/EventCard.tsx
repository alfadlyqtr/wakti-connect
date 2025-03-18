
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event.types";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { CalendarClock, MapPin } from "lucide-react";

export interface EventCardProps {
  event: Event;
  onCardClick?: () => void;
  onAccept?: (eventId: string) => void;
  onDecline?: (eventId: string) => void;
  viewType?: string; // Add this prop to fix the type error
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onCardClick, 
  onAccept, 
  onDecline,
  viewType 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  return (
    <Card 
      className={`${onCardClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} overflow-hidden`}
      onClick={onCardClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-1">{event.title}</h3>
          <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 pb-2">
        {event.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{event.description}</p>
        )}
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {(onAccept || onDecline) && (
        <CardFooter className="p-4 pt-2 flex space-x-2">
          {onDecline && (
            <Button variant="outline" className="flex-1" onClick={(e) => {
              e.stopPropagation();
              onDecline(event.id);
            }}>
              Decline
            </Button>
          )}
          
          {onAccept && (
            <Button className="flex-1" onClick={(e) => {
              e.stopPropagation();
              onAccept(event.id);
            }}>
              Accept
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
