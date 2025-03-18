
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Event } from "@/types/event.types";
import { Calendar, Clock, MapPin, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  onCardClick?: () => void;
  viewType?: 'sent' | 'received' | 'draft';
  onAccept?: (eventId: string) => void;
  onDecline?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onCardClick, 
  viewType = 'sent',
  onAccept,
  onDecline
}) => {
  const { id, title, description, location, start_time, end_time, status, customization } = event;
  
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
  const formattedStartDate = formatDate(new Date(start_time));
  const formattedStartTime = formatDate(new Date(start_time), { includeTime: true });
  const formattedEndTime = formatDate(new Date(end_time), { includeTime: true });
  
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
  
  // Animation class based on customization
  const getAnimationClass = () => {
    if (!safeCustomization.animation) return '';
    
    switch (safeCustomization.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in-right';
      case 'pop':
        return 'animate-scale-in';
      default:
        return '';
    }
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
  
  // Apply different layout based on viewType
  const getCardClassName = () => {
    let baseClass = `h-full transition-all hover:shadow-md ${getAnimationClass()}`;
    return baseClass;
  };
  
  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAccept) onAccept(id);
  };
  
  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDecline) onDecline(id);
  };
  
  // Get button style
  const getButtonStyle = (type: 'accept' | 'decline') => {
    const button = safeCustomization.buttons[type];
    return {
      backgroundColor: button.background,
      color: button.color,
      borderRadius: 
        button.shape === 'rounded' ? '0.375rem' : 
        button.shape === 'pill' ? '9999px' : '0'
    };
  };
  
  const handleClick = () => {
    if (onCardClick) onCardClick();
  };
  
  // Header based on headerStyle
  const renderHeader = () => {
    const { headerStyle, headerImage } = safeCustomization;
    
    switch (headerStyle) {
      case 'banner':
        return (
          <div className="w-full h-24 relative overflow-hidden rounded-t-lg">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
          </div>
        );
      case 'simple':
        return (
          <CardHeader>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg line-clamp-2">{title}</h3>
              <Badge variant={getBadgeVariant()} className="capitalize">
                {status}
              </Badge>
            </div>
          </CardHeader>
        );
      case 'minimal':
        return (
          <CardHeader>
            <div className="flex flex-col items-center">
              {headerImage ? (
                <img src={headerImage} alt="Header" className="w-16 h-16 rounded-full object-cover mb-2" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary mb-2"></div>
              )}
              <h3 className="text-lg font-medium text-center">{title}</h3>
              <Badge variant={getBadgeVariant()} className="capitalize mt-2">
                {status}
              </Badge>
            </div>
          </CardHeader>
        );
      default:
        return (
          <CardHeader>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg line-clamp-2">{title}</h3>
              <Badge variant={getBadgeVariant()} className="capitalize">
                {status}
              </Badge>
            </div>
          </CardHeader>
        );
    }
  };
  
  return (
    <Card 
      className={getCardClassName()}
      style={getCardStyle()}
      onClick={handleClick}
    >
      {renderHeader()}
      
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
      
      <CardFooter className="border-t pt-4 flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Created {formatDate(new Date(event.created_at))}
          </div>
          
          {event.invitations && (
            <div className="text-xs">
              {event.invitations.length} {event.invitations.length === 1 ? 'invitee' : 'invitees'}
            </div>
          )}
        </div>
        
        {/* Show accept/decline buttons for invitations that aren't accepted/declined yet */}
        {viewType === 'received' && status !== 'accepted' && status !== 'declined' && (
          <div className="flex justify-center gap-2 w-full mt-2">
            <button 
              className="py-1.5 px-3 flex items-center gap-1 text-sm rounded-md"
              style={getButtonStyle('accept')}
              onClick={handleAccept}
            >
              <Check className="w-3 h-3" /> Accept
            </button>
            
            <button 
              className="py-1.5 px-3 flex items-center gap-1 text-sm rounded-md"
              style={getButtonStyle('decline')}
              onClick={handleDecline}
            >
              <X className="w-3 h-3" /> Decline
            </button>
          </div>
        )}
        
        {/* Show edit button for drafts */}
        {viewType === 'draft' && status === 'draft' && (
          <Button variant="outline" size="sm" className="w-full">
            Edit Draft
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
