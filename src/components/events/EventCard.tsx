
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event.types";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { CalendarClock, MapPin, MoreVertical, Trash, Edit, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export interface EventCardProps {
  event: Event;
  onCardClick?: () => void;
  onAccept?: (eventId: string) => void;
  onDecline?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onEdit?: (event: Event) => void;
  onViewResponses?: (eventId: string) => void;
  viewType?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onCardClick, 
  onAccept, 
  onDecline,
  onDelete,
  onEdit,
  onViewResponses,
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

  // Use customization styles if available
  const getCustomCardStyle = () => {
    if (!event.customization) return {};

    const background = event.customization.background || { type: 'color', value: '#ffffff' };
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    } else if (background.type === 'gradient') {
      return { backgroundImage: background.value };
    } else if (background.type === 'image' && background.value) {
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    return {};
  };

  // Get text color based on customization
  const getTextStyle = () => {
    if (!event.customization?.font?.color) return {};
    
    return {
      color: event.customization.font.color
    };
  };

  // Check if the background is dark (this is a simple implementation)
  const isDarkBackground = () => {
    const bgType = event.customization?.background?.type;
    const bgValue = event.customization?.background?.value;
    
    if (bgType === 'color' && bgValue) {
      // Simple check for dark colors
      return bgValue.match(/#[0-9a-f]{6}/i) && 
        (bgValue.toLowerCase() === '#000000' || 
         bgValue.toLowerCase() === '#111111' || 
         bgValue.toLowerCase().startsWith('#00') || 
         bgValue.toLowerCase().startsWith('#11') || 
         bgValue.toLowerCase().startsWith('#22') || 
         bgValue.toLowerCase().startsWith('#33'));
    }
    
    return false;
  };

  // Custom header style for events with banner header style
  const renderCustomHeader = () => {
    if (!event.customization?.headerStyle || event.customization.headerStyle === 'simple') {
      return (
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-1" style={getTextStyle()}>{event.title}</h3>
          <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      );
    }

    // For banner style headers
    if (event.customization.headerStyle === 'banner' && event.customization.headerImage) {
      return (
        <div className="relative h-20 w-full overflow-hidden rounded-t-lg">
          <img 
            src={event.customization.headerImage} 
            alt="Event header" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-2">
            <div className="flex justify-end">
              <Badge 
                variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}
                className="bg-white/80 text-black"
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
            <h3 className="text-lg font-medium text-white">{event.title}</h3>
          </div>
        </div>
      );
    }

    // For minimal style headers with image
    if (event.customization.headerStyle === 'minimal') {
      return (
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {event.customization.headerImage && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={event.customization.headerImage} 
                  alt="Event" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <h3 className="text-lg font-medium line-clamp-1" style={getTextStyle()}>{event.title}</h3>
          </div>
          <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      );
    }

    // Default header
    return (
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium line-clamp-1" style={getTextStyle()}>{event.title}</h3>
        <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
      </div>
    );
  };

  // Get animation class
  const getAnimationClass = () => {
    if (!event.customization?.animation) return '';
    
    switch (event.customization.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'pop':
        return 'animate-scale-in';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={`${onCardClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} overflow-hidden ${getAnimationClass()}`}
      onClick={onCardClick ? () => onCardClick() : undefined}
      style={getCustomCardStyle()}
    >
      <CardHeader className="p-4 pb-2 relative">
        {renderCustomHeader()}
        
        {(viewType === 'draft' || viewType === 'sent') && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event.id);
                  }}>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                )}
                {viewType === 'sent' && onViewResponses && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onViewResponses(event.id);
                  }}>
                    <Users className="mr-2 h-4 w-4" /> View Responses
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-0 pb-2">
        {event.description && (
          <p 
            className="text-muted-foreground text-sm line-clamp-2 mb-2"
            style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle()}
          >
            {event.description}
          </p>
        )}
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle()}>
              {formatDate(event.start_time)}
            </span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span 
                className="line-clamp-1"
                style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle()}
              >
                {event.location}
              </span>
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
