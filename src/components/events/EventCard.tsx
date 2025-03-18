import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Edit, Trash, Check, X } from "lucide-react";
import { Event, EventStatus } from "@/types/event.types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onRespond?: (eventId: string, response: 'accepted' | 'declined') => void;
  isInvitation?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onRespond,
  isInvitation = false
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy - h:mm a");
  };
  
  // Get status badge color
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'recalled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  // Get status display text
  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'sent':
        return 'Sent';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'recalled':
        return 'Recalled';
      default:
        return 'Unknown';
    }
  };
  
  // Get invitation count
  const getInvitationCount = () => {
    if (!event.invitations) return 0;
    return event.invitations.length;
  };
  
  // Get accepted count
  const getAcceptedCount = () => {
    if (!event.invitations) return 0;
    return event.invitations.filter(inv => inv.status === 'accepted').length;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="mt-1">
              {event.description || "No description provided"}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(event.status)}>
            {getStatusText(event.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            {event.is_all_day 
              ? format(new Date(event.start_time), "MMMM d, yyyy") + " (All day)"
              : formatDate(event.start_time)}
          </span>
        </div>
        
        {!event.is_all_day && (
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {format(new Date(event.start_time), "h:mm a")} - {format(new Date(event.end_time), "h:mm a")}
            </span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
        
        {!isInvitation && event.invitations && event.invitations.length > 0 && (
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {getAcceptedCount()} accepted / {getInvitationCount()} invited
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isInvitation ? (
          // Invitation response buttons
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onRespond && onRespond(event.id, 'declined')}
              disabled={event.status === 'declined'}
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button 
              className="flex-1"
              onClick={() => onRespond && onRespond(event.id, 'accepted')}
              disabled={event.status === 'accepted'}
            >
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </div>
        ) : (
          // Event management buttons
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(event)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(event.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
