import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event.types";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { CalendarClock, MapPin, MoreVertical, Trash, Edit, Users, QrCode, Calendar, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

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
  const [showQrCode, setShowQrCode] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);

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

  const getTextStyle = (type?: 'header' | 'description' | 'datetime') => {
    const { font, headerFont, descriptionFont, dateTimeFont } = event.customization || {};
    
    if (!font?.color) return {};

    let specificFont;
    if (type === 'header' && headerFont) {
      specificFont = headerFont;
    } else if (type === 'description' && descriptionFont) {
      specificFont = descriptionFont;
    } else if (type === 'datetime' && dateTimeFont) {
      specificFont = dateTimeFont;
    }
    
    if (!specificFont) {
      return { color: font.color };
    }
    
    return {
      color: specificFont.color || font.color,
      fontFamily: specificFont.family || font.family,
      fontWeight: specificFont.weight === 'bold' ? 'bold' : 
                 specificFont.weight === 'medium' ? '500' : 'normal',
    };
  };

  const isDarkBackground = () => {
    const bgType = event.customization?.background?.type;
    const bgValue = event.customization?.background?.value;
    
    if (bgType === 'color' && bgValue) {
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

  const renderCustomHeader = () => {
    if (!event.customization?.headerStyle || event.customization.headerStyle === 'simple') {
      return (
        <div className="flex justify-between items-start">
          <h3 
            className={`text-lg font-medium line-clamp-1 ${event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
              event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
              event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''}`}
            style={getTextStyle('header')}
          >
            {event.title}
          </h3>
          <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      );
    }

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
            <h3 
              className={`text-lg font-medium text-white ${
                event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
                event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
                event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
              }`}
            >
              {event.title}
            </h3>
          </div>
        </div>
      );
    }

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
            <h3 
              className={`text-lg font-medium line-clamp-1 ${
                event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
                event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
                event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
              }`}
              style={getTextStyle('header')}
            >
              {event.title}
            </h3>
          </div>
          <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-start">
        <h3 
          className={`text-lg font-medium line-clamp-1 ${
            event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
            event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
            event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
          }`}
          style={getTextStyle('header')}
        >
          {event.title}
        </h3>
        <Badge variant={event.status === 'accepted' ? 'success' : event.status === 'declined' ? 'destructive' : 'outline'}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
      </div>
    );
  };

  const renderBranding = () => {
    const { branding } = event.customization || {};
    
    if (!branding?.logo && !branding?.slogan) return null;
    
    return (
      <div className={`flex flex-col items-center mt-4 mb-2 ${
        event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
        event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
        event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
      }`}>
        {branding.logo && (
          <img src={branding.logo} alt="Business logo" className="h-8 mb-1 object-contain" />
        )}
        {branding.slogan && (
          <p className="text-xs text-muted-foreground">{branding.slogan}</p>
        )}
      </div>
    );
  };

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

  const getCardEffectClass = () => {
    if (!event.customization?.cardEffect?.type) return 'shadow-md';
    
    switch (event.customization.cardEffect.type) {
      case 'shadow':
        return 'shadow-lg';
      case 'matte':
        return 'shadow-sm bg-opacity-90';
      case 'gloss':
        return 'shadow-lg bg-opacity-95 backdrop-blur-sm';
      default:
        return 'shadow-md';
    }
  };
  
  const getBorderRadiusClass = () => {
    if (!event.customization?.cardEffect?.borderRadius) return 'rounded-lg';
    
    switch (event.customization.cardEffect.borderRadius) {
      case 'none':
        return 'rounded-none';
      case 'small':
        return 'rounded-sm';
      case 'medium':
        return 'rounded-md';
      case 'large':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };
  
  const getBorderStyle = () => {
    if (event.customization?.cardEffect?.border) {
      return {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: event.customization.cardEffect.borderColor || '#e2e8f0'
      };
    }
    return {};
  };

  const getUtilityButtonStyle = (type: 'calendar' | 'map' | 'qr') => {
    const buttonStyle = event.customization?.utilityButtons?.[type];
    
    if (!buttonStyle) return {};
    
    return {
      backgroundColor: buttonStyle.background || undefined,
      color: buttonStyle.color || undefined,
      borderRadius: buttonStyle.shape === 'pill' ? '9999px' : 
                   buttonStyle.shape === 'rounded' ? '0.375rem' : '0'
    };
  };

  const handleButtonClick = (action: 'map' | 'qr' | 'calendar', e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action === 'map') {
      setShowMapDialog(true);
    } else if (action === 'qr') {
      setShowQrCode(true);
    } else if (action === 'calendar') {
      setShowCalendarDialog(true);
    }
  };
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareableLink = `${window.location.origin}/events/view/${event.id}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Event link has been copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Failed to Copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAccept) {
      onAccept(event.id);
      setShowCalendarDialog(true);
    }
  };

  const handleDeclineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDecline) {
      onDecline(event.id);
    }
  };
  
  const getPoweredByStyle = () => {
    return {
      color: event.customization?.poweredByColor || '#888888',
      fontSize: '0.7rem',
      fontWeight: 'normal'
    };
  };

  const renderQrCodeDialog = () => {
    return (
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to view the event details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
              <QrCode size={140} className="text-gray-800" />
            </div>
            <p className="text-center text-sm font-medium">Scan to view event</p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>
              <Button onClick={() => setShowQrCode(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  const renderMapDialog = () => {
    return (
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Location</DialogTitle>
            <DialogDescription>
              {event.location || "No location specified"}
            </DialogDescription>
          </DialogHeader>
          <div className="h-64 bg-gray-200 flex items-center justify-center mb-4">
            <MapPin size={40} className="text-gray-400" />
            <p className="text-gray-500 ml-2">Map View</p>
          </div>
          <Button 
            onClick={() => setShowMapDialog(false)}
            className="w-full"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  };
  
  const renderCalendarDialog = () => {
    return (
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Calendar</DialogTitle>
            <DialogDescription>
              Add this event to your WAKTI calendar
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <Button 
              onClick={() => {
                toast({
                  title: "Added to Calendar",
                  description: "Event has been added to your WAKTI calendar",
                });
                setShowCalendarDialog(false);
              }}
              className="px-8"
            >
              <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card 
      className={`${onCardClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} 
        overflow-hidden ${getAnimationClass()} ${getCardEffectClass()} ${getBorderRadiusClass()}`}
      onClick={onCardClick ? () => onCardClick() : undefined}
      style={{
        ...getCustomCardStyle(),
        ...getBorderStyle()
      }}
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
            className={`text-muted-foreground text-sm line-clamp-2 mb-2 ${
              event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
              event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
              event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
            }`}
            style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle('description')}
          >
            {event.description}
          </p>
        )}
        
        <div className="space-y-1 text-sm">
          <div 
            className={`flex items-center gap-1 ${
              event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
              event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
              event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
            }`}
          >
            <CalendarClock 
              className={`h-4 w-4 text-muted-foreground ${
                event.customization?.elementAnimations?.icons === 'fade' ? 'animate-fade-in' : 
                event.customization?.elementAnimations?.icons === 'slide' ? 'animate-slide-in' : 
                event.customization?.elementAnimations?.icons === 'pop' ? 'animate-scale-in' : ''
              }`} 
            />
            <span 
              style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle('datetime')}
            >
              {formatDate(event.start_time)}
            </span>
          </div>
          
          {event.location && (
            <div 
              className={`flex items-center gap-1 ${
                event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
                event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
                event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
              }`}
            >
              <MapPin 
                className={`h-4 w-4 text-muted-foreground ${
                  event.customization?.elementAnimations?.icons === 'fade' ? 'animate-fade-in' : 
                  event.customization?.elementAnimations?.icons === 'slide' ? 'animate-slide-in' : 
                  event.customization?.elementAnimations?.icons === 'pop' ? 'animate-scale-in' : ''
                }`} 
              />
              <span 
                className="line-clamp-1"
                style={isDarkBackground() ? { color: 'rgba(255,255,255,0.8)' } : getTextStyle()}
              >
                {event.location}
              </span>
            </div>
          )}
        </div>

        {event.customization?.enableChatbot && (
          <div className={`mt-3 p-2 border rounded-md bg-background/50 text-xs ${
            event.customization?.elementAnimations?.text === 'fade' ? 'animate-fade-in' : 
            event.customization?.elementAnimations?.text === 'slide' ? 'animate-slide-in' : 
            event.customization?.elementAnimations?.text === 'pop' ? 'animate-scale-in' : ''
          }`}>
            <p>Ask me about this event! (Chatbot enabled)</p>
          </div>
        )}

        {renderBranding()}

        {event.location && (
          <div className={`grid grid-cols-2 gap-2 mt-3 ${
            event.customization?.elementAnimations?.buttons === 'fade' ? 'animate-fade-in' : 
            event.customization?.elementAnimations?.buttons === 'slide' ? 'animate-slide-in' : 
            event.customization?.elementAnimations?.buttons === 'pop' ? 'animate-scale-in' : ''
          }`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center justify-center gap-1"
              style={getUtilityButtonStyle('map')}
              onClick={(e) => handleButtonClick('map', e)}
            >
              <MapPin className={`h-3 w-3 ${event.customization?.elementAnimations?.icons || ''}`} /> 
              Map
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center justify-center gap-1"
              style={getUtilityButtonStyle('qr')}
              onClick={(e) => handleButtonClick('qr', e)}
            >
              <QrCode className={`h-3 w-3 ${event.customization?.elementAnimations?.icons || ''}`} /> 
              QR Code
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground mt-3">
          <span 
            className="hover:underline"
            style={getPoweredByStyle()}
          >
            Powered by WAKTI
          </span>
        </div>
      </CardContent>
      
      {(onAccept || onDecline) && (event.customization?.showAcceptDeclineButtons !== false) && (
        <CardFooter 
          className={`p-4 pt-2 flex space-x-2 ${
            event.customization?.elementAnimations?.buttons === 'fade' ? 'animate-fade-in' : 
            event.customization?.elementAnimations?.buttons === 'slide' ? 'animate-slide-in' : 
            event.customization?.elementAnimations?.buttons === 'pop' ? 'animate-scale-in' : ''
          }`}
        >
          {onDecline && (
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleDeclineClick}
              style={event.customization?.buttons?.decline ? {
                backgroundColor: event.customization.buttons.decline.background,
                color: event.customization.buttons.decline.color,
                borderRadius: event.customization.buttons.decline.shape === 'pill' ? '9999px' : 
                             event.customization.buttons.decline.shape === 'rounded' ? '0.375rem' : '0px'
              } : {}}
            >
              Decline
            </Button>
          )}
          
          {onAccept && (
            <Button 
              className="flex-1" 
              onClick={handleAcceptClick}
              style={event.customization?.buttons?.accept ? {
                backgroundColor: event.customization.buttons.accept.background,
                color: event.customization.buttons.accept.color,
                borderRadius: event.customization.buttons.accept.shape === 'pill' ? '9999px' : 
                             event.customization.buttons.accept.shape === 'rounded' ? '0.375rem' : '0px'
              } : {}}
            >
              Accept
            </Button>
          )}
        </CardFooter>
      )}
      
      {renderQrCodeDialog()}
      {renderMapDialog()}
      {renderCalendarDialog()}
    </Card>
  );
};

export default EventCard;
