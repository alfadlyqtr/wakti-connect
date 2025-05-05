
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar.types";
import { useCalendarEventUtils } from "@/hooks/useCalendarEventUtils";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, MapPin, AlertCircle, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarEventItemProps {
  event: CalendarEvent;
}

export const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ 
  event 
}) => {
  const { getEventColors } = useCalendarEventUtils();
  const { bgClass, textClass, borderClass } = getEventColors(event);
  
  // Icons based on event type
  const getEventIcon = () => {
    switch(event.type) {
      case 'booking':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'event':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'task':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'manual':
        return <MapPin className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Format time if available
  const timeDisplay = event.start && event.end ? (
    <span className="text-xs text-muted-foreground whitespace-nowrap">
      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
    </span>
  ) : null;

  return (
    <Card className={cn(
      "p-2 flex items-center justify-between border group hover:shadow-sm transition-all",
      event.color ? `border-l-4 border-l-[${event.color}]` : borderClass
    )}>
      <div className="flex items-center space-x-2 truncate">
        <div className={cn("flex items-center", textClass)}>
          {getEventIcon()}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate max-w-[200px]">
                  {event.title}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 max-w-xs">
                  <p className="font-medium">{event.title}</p>
                  {event.description && <p className="text-xs">{event.description}</p>}
                  {event.location && (
                    <div className="flex items-center text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {timeDisplay && (
                    <div className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {timeDisplay}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex items-center">
        {timeDisplay}
      </div>
    </Card>
  );
};
