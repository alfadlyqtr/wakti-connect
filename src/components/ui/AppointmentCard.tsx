
import React from "react";
import { Calendar, Clock, MapPin, Users, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

interface AppointmentCardProps {
  id: string;
  title: string;
  dateTime: Date;
  location?: string;
  status: AppointmentStatus;
  invitees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  userRole?: "free" | "individual" | "business";
}

const AppointmentCard = ({
  id,
  title,
  dateTime,
  location,
  status,
  invitees = [],
  userRole = "free",
}: AppointmentCardProps) => {
  // Status Badge colors
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Limit the number of invitees shown
  const displayInvitees = invitees.slice(0, 3);
  const remainingInvitees = invitees.length - 3;

  return (
    <Card className={cn(
      "appointment-card group transition-all duration-300",
      status === "cancelled" && "opacity-70",
      "hover:shadow-md hover:border-primary/20"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div>
          <h3 className={cn(
            "font-medium text-base transition-all duration-200",
            status === "cancelled" && "text-muted-foreground"
          )}>
            {title}
          </h3>
          <Badge variant="outline" className={cn("mt-1 text-xs", getStatusColor(status))}>
            {status}
          </Badge>
        </div>
        {isPaidAccount ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Appointment menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Confirm</DropdownMenuItem>
              <DropdownMenuItem>Reschedule</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
            View Only
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(dateTime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(dateTime)}</span>
          </div>
          
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {invitees.length > 0 && (
        <CardFooter className="p-4 pt-0 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex -space-x-2">
            {displayInvitees.map((invitee) => (
              <Avatar key={invitee.id} className="h-6 w-6 border-2 border-background">
                {invitee.avatar ? (
                  <AvatarImage src={invitee.avatar} alt={invitee.name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {invitee.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
            
            {remainingInvitees > 0 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{remainingInvitees}
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
