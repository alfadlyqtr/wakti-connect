
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
  const { borderClass } = getEventColors(event);
  
  // Icons based on event type
  const getEventIcon = () => {
    switch(event.type) {
      case 'booking':
        return <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />;
      case 'event':
        return <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />;
      case 'task':
        return <Clock className="h-4 w-4 mr-1 flex-shrink-0" />;
      case 'manual':
        return <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />;
      default:
        return null;
    }
  };

  // Format time if available
  const timeDisplay = event.start && event.end ? (
    <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto pl-2">
      {format(new Date(event.start), 'h:mm a')}
    </span>
  ) : null;
  
  // Define border color based on event type
  const getEventBorder = () => {
    switch(event.type) {
      case 'booking':
        return "border-l-blue-500";
      case 'event':
        return "border-l-purple-500";
      case 'task':
        return "border-l-amber-500";
      case 'manual':
        return "border-l-orange-500";
      default:
        return "";
    }
  };

  return (
    <Card className={cn(
      "p-2 flex items-center border-l-4 hover:shadow-sm transition-all",
      getEventBorder()
    )}>
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <div className="flex items-center">
          {getEventIcon()}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate max-w-[200px] text-sm">
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
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {timeDisplay}
    </Card>
  );
};
