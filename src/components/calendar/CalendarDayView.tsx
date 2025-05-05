
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, MapPin, Calendar, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  onCompleteTask?: (taskId: string) => void;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  date,
  events,
  onCompleteTask
}) => {
  // Group events by type
  const tasks = events.filter(event => event.type === "task");
  const bookings = events.filter(event => event.type === "booking");
  const otherEvents = events.filter(event => event.type === "event");

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{format(date, "MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No events scheduled for this day
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderEvents = (title: string, eventsList: CalendarEvent[], type: "task" | "booking" | "event") => {
    if (eventsList.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          {type === "task" && <CheckSquare className="h-4 w-4 text-amber-500" />}
          {type === "booking" && <Calendar className="h-4 w-4 text-green-500" />}
          {type === "event" && <Calendar className="h-4 w-4 text-blue-500" />}
          {title}
          <Badge variant="outline" className="ml-2 font-normal">
            {eventsList.length}
          </Badge>
        </h3>
        
        <div className="space-y-2">
          {eventsList.map(event => (
            <div 
              key={event.id} 
              className={`p-3 border rounded-lg ${
                type === "task" ? "bg-amber-50/50 border-amber-200" :
                type === "booking" ? "bg-green-50/50 border-green-200" :
                "bg-blue-50/50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  {type === "task" && (
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id={`task-${event.id}`}
                        checked={event.isCompleted} 
                        onCheckedChange={() => onCompleteTask && onCompleteTask(event.id)}
                      />
                      <label 
                        htmlFor={`task-${event.id}`}
                        className={`font-medium ${event.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {event.title}
                      </label>
                    </div>
                  )}
                  
                  {(type === "booking" || type === "event") && (
                    <h4 className="font-medium">{event.title}</h4>
                  )}
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                    {(event.startTime || event.endTime) && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </span>
                    )}
                    
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                    
                    {event.priority && (
                      <Badge variant={event.priority === "urgent" ? "destructive" : "outline"} className="text-[10px] h-4">
                        {event.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Show appropriate status badge for each event type */}
                {event.status && (
                  <Badge 
                    variant={
                      event.status === "completed" || event.status === "confirmed" ? "outline" : 
                      event.status === "pending" ? "secondary" : 
                      "outline"
                    }
                    className="text-[10px]"
                  >
                    {event.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{format(date, "MMMM d, yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderEvents("Tasks", tasks, "task")}
        
        {tasks.length > 0 && (bookings.length > 0 || otherEvents.length > 0) && (
          <Separator className="my-4" />
        )}
        
        {renderEvents("Bookings", bookings, "booking")}
        
        {(tasks.length > 0 || bookings.length > 0) && otherEvents.length > 0 && (
          <Separator className="my-4" />
        )}
        
        {renderEvents("Events", otherEvents, "event")}
      </CardContent>
    </Card>
  );
};

export default CalendarDayView;
