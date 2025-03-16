
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface AppointmentCardProps {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay?: boolean;
  status?: "upcoming" | "completed" | "cancelled";
  description?: string;
  userRole?: "free" | "individual" | "business";
  isAssigned?: boolean;
  isShared?: boolean;
  onClick?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  startTime,
  endTime,
  location,
  isAllDay = false,
  status = "upcoming",
  onClick,
}) => {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge className={cn(statusColors[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(startTime, "MMMM d, yyyy")}</span>
          </div>
          {!isAllDay && (
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
              </span>
            </div>
          )}
          {location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
