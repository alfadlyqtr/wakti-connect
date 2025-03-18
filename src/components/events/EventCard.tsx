
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Event } from "@/types/event.types";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";

interface EventCardProps {
  event: Event;
  onCardClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onCardClick }) => {
  const { title, description, location, start_time, end_time, status, customization } = event;
  
  // Ensure customization has default values
  const safeCustomization = customization || {
    background: { type: 'color', value: '#ffffff' },
    font: { family: 'system-ui', size: 'medium', color: '#333333' },
    buttons: {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' }
    },
    headerStyle: 'simple'
  };
  
  // Format date and time
  const formattedStartDate = formatDate(new Date(start_time), "PPP");
  const formattedStartTime = formatDate(new Date(start_time), "p");
  const formattedEndTime = formatDate(new Date(end_time), "p");
  
  // Style based on customization
  const getCardStyle = () => {
    const style: React.CSSProperties = {};
    
    // Background
    if (safeCustomization.background) {
      if (safeCustomization.background.type === 'color') {
        style.backgroundColor = safeCustomization.background.value;
      } else if (safeCustomization.background.type === 'gradient') {
        style.backgroundImage = safeCustomization.background.value;
      } else if (safeCustomization.background.type === 'image') {
        style.backgroundImage = `url(${safeCustomization.background.value})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
      }
    }
    
    // Font
    if (safeCustomization.font) {
      style.fontFamily = safeCustomization.font.family;
      style.color = safeCustomization.font.color;
    }
    
    return style;
  };
  
  // Status badge color
  const getBadgeVariant = () => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'destructive';
      case 'recalled':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  return (
    <Card 
      className="h-full cursor-pointer transition-all hover:shadow-md"
      style={getCardStyle()}
      onClick={onCardClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-2">{title}</h3>
          <Badge variant={getBadgeVariant()} className="capitalize">
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedStartDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formattedStartTime} - {formattedEndTime}</span>
          </div>
          
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Created {formatDate(new Date(event.created_at), "PP")}
          </div>
          
          {event.invitations && (
            <div className="text-xs">
              {event.invitations.length} {event.invitations.length === 1 ? 'invitee' : 'invitees'}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
