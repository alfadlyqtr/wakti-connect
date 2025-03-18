
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle,
  Share2
} from "lucide-react";
import { Event, EventStatus } from "@/services/event";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { useEvents } from "@/hooks/useEvents";

interface EventCardProps {
  event: Event;
  viewType?: "sent" | "received";
  onRespond?: (response: "accepted" | "declined") => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  viewType = "sent",
  onRespond,
  className
}) => {
  const { respondToInvitation } = useEvents();
  
  const handleRespond = async (response: "accepted" | "declined") => {
    if (onRespond) {
      onRespond(response);
    } else {
      try {
        const success = await respondToInvitation(event.id, response);
        if (success) {
          toast({
            title: `Event ${response}`,
            description: `You have ${response} the event invitation.`,
          });
        }
      } catch (error) {
        console.error(`Error ${response} event:`, error);
      }
    }
  };
  
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "sent":
        return <Badge variant="secondary">Sent</Badge>;
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "recalled":
        return <Badge variant="outline" className="bg-gray-200">Recalled</Badge>;
      default:
        return null;
    }
  };
  
  // Apply customization styles if available
  const customStyles = event.customization || {};
  const cardStyle = {
    backgroundColor: customStyles.backgroundColor,
    backgroundImage: customStyles.backgroundImage,
    fontFamily: customStyles.fontFamily,
  };
  
  const isRecalled = event.is_recalled;
  
  return (
    <Card 
      className={cn("overflow-hidden", className)} 
      style={cardStyle}
    >
      {isRecalled && (
        <div className="bg-destructive/10 p-2 text-center">
          <p className="text-xs flex items-center justify-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            This invitation has been recalled by the sender
          </p>
        </div>
      )}
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            {getStatusBadge(event.status)}
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {formatDate(event.created_at)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-4">
        {event.description && (
          <p className="text-sm">{event.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          
          {!event.is_all_day && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-4 flex justify-between">
        {viewType === "received" && !isRecalled && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => handleRespond("declined")}
              disabled={event.status === "declined" || event.status === "accepted"}
            >
              <X className="h-4 w-4 mr-1" /> Decline
            </Button>
            
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleRespond("accepted")}
              disabled={event.status === "declined" || event.status === "accepted"}
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
          </>
        )}
        
        {viewType === "sent" && (
          <Button variant="outline" size="sm" className="ml-auto">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        )}
        
        {(event.status === "accepted" || event.status === "declined") && (
          <Badge 
            variant={event.status === "accepted" ? "success" : "destructive"}
            className="ml-auto"
          >
            {event.status === "accepted" ? (
              <Check className="h-3.5 w-3.5 mr-1" />
            ) : (
              <X className="h-3.5 w-3.5 mr-1" />
            )}
            {event.status === "accepted" ? "Accepted" : "Declined"}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
