
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { RecurringBadge } from "@/components/ui/RecurringBadge";

interface AppointmentCardProps {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  status: "scheduled" | "cancelled" | "completed";
  isRecurring?: boolean;
  recurringFrequency?: string;
  isRecurringInstance?: boolean;
  isAssigned?: boolean;
  isShared?: boolean;
}

const AppointmentCard = ({
  id,
  title,
  description,
  location,
  startTime,
  endTime,
  isAllDay = false,
  status,
  isRecurring = false,
  recurringFrequency,
  isRecurringInstance = false,
  isAssigned = false,
  isShared = false
}: AppointmentCardProps) => {
  // Format the dates
  const startDate = format(startTime, "MMM d, yyyy");
  const startTimeFormatted = isAllDay ? "All day" : format(startTime, "h:mm a");
  const endTimeFormatted = isAllDay ? "" : format(endTime, "h:mm a");
  
  // Status badge color mapping
  const statusColors = {
    scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20"
  };
  
  return (
    <Card className="border-border/40 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={`font-normal ${statusColors[status]}`}
            >
              {status === "scheduled" ? "Upcoming" : 
               status === "cancelled" ? "Cancelled" : "Completed"}
            </Badge>
            {(isRecurring || isRecurringInstance) && (
              <RecurringBadge 
                frequency={recurringFrequency} 
                isRecurringInstance={isRecurringInstance} 
              />
            )}
            {isAssigned && (
              <Badge variant="outline" className="font-normal bg-purple-500/10 text-purple-500 border-purple-500/20">
                Assigned
              </Badge>
            )}
            {isShared && (
              <Badge variant="outline" className="font-normal bg-green-500/10 text-green-500 border-green-500/20">
                Shared
              </Badge>
            )}
          </div>
          <div className="flex items-center">
            {/* Menu or actions can be added here */}
          </div>
        </div>
        <h3 className="text-base font-semibold leading-tight mt-1">{title}</h3>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-2">
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{startDate}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{startTimeFormatted}{!isAllDay && endTimeFormatted ? ` - ${endTimeFormatted}` : ""}</span>
        </div>
        
        {location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        {/* Additional content like badges, actions, or participants can go here */}
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
