import React, { useState } from "react";
import { EventCustomization } from "@/types/event.types";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, QrCode, Calendar, Smartphone, Monitor, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LivePreviewProps {
  customization: EventCustomization;
  title: string;
  description?: string;
  location?: string;
  dateTime?: string;
  viewMode: 'mobile' | 'desktop';
  onViewModeChange: (mode: 'mobile' | 'desktop') => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  customization,
  title,
  description,
  location,
  dateTime,
  viewMode,
  onViewModeChange
}) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  
  const handleButtonClick = (action: 'map' | 'qr' | 'calendar', e: React.MouseEvent) => {
    e.preventDefault();
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
    e.preventDefault();
    e.stopPropagation();
    
    const shareableLink = `${window.location.origin}/events/view/preview-${Date.now()}`;
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
  
  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowCalendarDialog(true);
    
    toast({
      title: "Event Accepted",
      description: "You've accepted this event",
    });
  };
  
  const handleDecline = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Event Declined",
      description: "You've declined this event",
    });
  };
  
  const getBackgroundStyle = () => {
    const { background } = customization;
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    } else if (background.type === 'gradient') {
      if (background.value.includes('linear-gradient')) {
        return { backgroundImage: background.value };
      } else if (background.angle !== undefined) {
        return { 
          backgroundImage: `linear-gradient(${background.angle}deg, ${background.value})` 
        };
      } else {
        const direction = background.direction || 'to-right';
        const directionValue = direction.replace('to-', 'to ');
        return { 
          backgroundImage: `linear-gradient(${directionValue}, ${background.value})` 
        };
      }
    } else if (background.type === 'image') {
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };
  
  const getTextStyle = (type?: 'header' | 'description' | 'datetime') => {
    const { font, headerFont, descriptionFont, dateTimeFont } = customization;
    
    let specificFont;
    if (type === 'header' && headerFont) {
      specificFont = headerFont;
    } else if (type === 'description' && descriptionFont) {
      specificFont = descriptionFont;
    } else if (type === 'datetime' && dateTimeFont) {
      specificFont = dateTimeFont;
    }
    
    const baseFont = {
      fontFamily: font.family,
      color: font.color,
      fontSize: font.size === 'small' ? '0.875rem' : 
               font.size === 'medium' ? '1rem' : '1.25rem',
      fontWeight: font.weight === 'bold' ? 'bold' : 
                 font.weight === 'medium' ? '500' : 'normal',
      textAlign: font.alignment as any
    };
    
    if (!specificFont) return baseFont;
    
    return {
      ...baseFont,
      fontFamily: specificFont.family || baseFont.fontFamily,
      color: specificFont.color || baseFont.color,
      fontSize: specificFont.size === 'small' ? '0.875rem' : 
                specificFont.size === 'medium' ? '1rem' : 
                specificFont.size === 'large' ? '1.25rem' : baseFont.fontSize,
      fontWeight: specificFont.weight === 'bold' ? 'bold' : 
                 specificFont.weight === 'medium' ? '500' : 
                 specificFont.weight === 'normal' ? 'normal' : baseFont.fontWeight
    };
  };
  
  const getButtonStyle = (type: 'accept' | 'decline') => {
    const button = customization.buttons[type];
    return {
      backgroundColor: button.background,
      color: button.color,
      borderRadius: button.shape === 'rounded' ? '0.375rem' : 
                   button.shape === 'pill' ? '9999px' : '0'
    };
  };
  
  const getAnimationClass = () => {
    if (!customization.animation) return '';
    
    switch (customization.animation) {
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

  const getElementAnimationClass = (type: 'text' | 'buttons' | 'icons', index: number = 0) => {
    if (!customization.elementAnimations) return '';
    
    const animation = customization.elementAnimations[type];
    if (!animation || animation === 'none') return '';
    
    let animClass = '';
    switch (animation) {
      case 'fade':
        animClass = 'animate-fade-in';
        break;
      case 'slide':
        animClass = 'animate-slide-in';
        break;
      case 'pop':
        animClass = 'animate-scale-in';
        break;
      default:
        return '';
    }
    
    if (customization.elementAnimations.delay === 'staggered') {
      return `${animClass} [animation-delay:${index * 0.1}s]`;
    } else if (customization.elementAnimations.delay === 'sequence') {
      return `${animClass} [animation-delay:${index * 0.3}s]`;
    }
    
    return animClass;
  };

  const getCardEffectClass = () => {
    const effectType = customization.cardEffect?.type || 'shadow';
    
    switch (effectType) {
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
    const radius = customization.cardEffect?.borderRadius || 'medium';
    
    switch (radius) {
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
    if (customization.cardEffect?.border) {
      return {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: customization.cardEffect.borderColor || '#e2e8f0'
      };
    }
    return {};
  };
  
  const getUtilityButtonStyle = (type: 'calendar' | 'map' | 'qr') => {
    const buttonStyle = customization.utilityButtons?.[type];
    
    if (!buttonStyle) return {};
    
    return {
      backgroundColor: buttonStyle.background || undefined,
      color: buttonStyle.color || undefined,
      borderRadius: buttonStyle.shape === 'pill' ? '9999px' : 
                   buttonStyle.shape === 'rounded' ? '0.375rem' : '0'
    };
  };
  
  const renderHeader = () => {
    const { headerStyle, headerImage } = customization;
    const headerTextStyle = getTextStyle('header');
    
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
              <h2 className={`text-xl font-bold text-white ${getElementAnimationClass('text')}`}>{title}</h2>
            </div>
          </div>
        );
      case 'simple':
        return (
          <div className="p-4 border-b">
            <h2 
              className={`text-xl font-bold text-center ${getElementAnimationClass('text')}`}
              style={headerTextStyle}
            >
              {title}
            </h2>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center p-4">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-16 h-16 rounded-full object-cover mb-2" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary mb-2"></div>
            )}
            <h2 
              className={`text-lg font-medium ${getElementAnimationClass('text')}`}
              style={headerTextStyle}
            >
              {title}
            </h2>
          </div>
        );
      default:
        return (
          <h2 
            className={`text-xl font-bold p-4 ${getElementAnimationClass('text')}`}
            style={headerTextStyle}
          >
            {title}
          </h2>
        );
    }
  };
  
  const renderBranding = () => {
    const { branding } = customization;
    
    if (!branding?.logo && !branding?.slogan) return null;
    
    return (
      <div className={`flex flex-col items-center mt-4 mb-2 ${getElementAnimationClass('text')}`}>
        {branding.logo && (
          <img src={branding.logo} alt="Business logo" className="h-8 mb-1 object-contain" />
        )}
        {branding.slogan && (
          <p className="text-xs text-muted-foreground">{branding.slogan}</p>
        )}
      </div>
    );
  };

  const getPoweredByStyle = () => {
    return {
      color: customization.poweredByColor || '#888888',
      fontSize: '0.7rem',
      fontWeight: 'normal'
    };
  };
  
  const renderQrCodeFlip = () => {
    if (!showQrCode) return null;

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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopyLink(e);
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQrCode(false);
                }}
              >
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
              {location || "No location specified"}
            </DialogDescription>
          </DialogHeader>
          <div className="h-64 bg-gray-200 flex items-center justify-center mb-4">
            <MapPin size={40} className="text-gray-400" />
            <p className="text-gray-500 ml-2">Map View</p>
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMapDialog(false);
            }}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'mobile' ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewModeChange('mobile');
            }}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'desktop' ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewModeChange('desktop');
            }}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        className={cn(
          "border overflow-hidden mx-auto transition-all",
          getAnimationClass(),
          getCardEffectClass(),
          getBorderRadiusClass(),
          viewMode === 'mobile' ? 'w-[320px] sm:w-[320px]' : 'w-full sm:w-[500px]'
        )}
        style={{
          maxWidth: '100%',
          ...getBackgroundStyle(),
          ...getBorderStyle()
        }}
      >
        {renderHeader()}
        
        <div className="p-4" style={getTextStyle()}>
          {description && (
            <p 
              className={`mb-4 ${getElementAnimationClass('text', 1)}`}
              style={getTextStyle('description')}
            >
              {description}
            </p>
          )}
          
          {dateTime && (
            <p 
              className={`mb-2 flex items-center ${getElementAnimationClass('text', 2)}`}
              style={getTextStyle('datetime')}
            >
              <span className={`mr-2 ${getElementAnimationClass('icons', 0)}`}>📅</span> {dateTime}
            </p>
          )}
          
          {location && (
            <p 
              className={`mb-4 flex items-center ${getElementAnimationClass('text', 3)}`}
            >
              <span className={`mr-2 ${getElementAnimationClass('icons', 1)}`}>📍</span> {location}
            </p>
          )}
          
          {customization.enableChatbot && (
            <div className={`mb-4 p-2 border rounded-md bg-background/50 ${getElementAnimationClass('text', 4)}`}>
              <p className="text-sm">Ask me about this event! (Chatbot enabled)</p>
            </div>
          )}
          
          {(customization.showAcceptDeclineButtons !== false) && (
            <div className={`flex justify-center gap-3 mt-6 mb-3 ${getElementAnimationClass('buttons', 0)}`}>
              <button 
                className="py-2 px-4 flex items-center gap-1"
                style={getButtonStyle('accept')}
                onClick={handleAccept}
              >
                <Check className="w-4 h-4" /> Accept
              </button>
              
              <button
                className="py-2 px-4 flex items-center gap-1"
                style={getButtonStyle('decline')}
                onClick={handleDecline}
              >
                <X className="w-4 h-4" /> Decline
              </button>
            </div>
          )}
          
          {location && (
            <div className={`grid grid-cols-2 gap-2 mt-4 ${getElementAnimationClass('buttons', 1)}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center justify-center gap-1"
                style={getUtilityButtonStyle('map')}
                onClick={(e) => handleButtonClick('map', e)}
              >
                <MapPin className={`h-3 w-3 ${getElementAnimationClass('icons', 3)}`} /> 
                Map
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center justify-center gap-1"
                style={getUtilityButtonStyle('qr')}
                onClick={(e) => handleButtonClick('qr', e)}
              >
                <QrCode className={`h-3 w-3 ${getElementAnimationClass('icons', 4)}`} /> 
                QR Code
              </Button>
            </div>
          )}
          
          {renderBranding()}
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            <a 
              href="#"
              className="hover:underline"
              onClick={(e) => e.preventDefault()}
              style={getPoweredByStyle()}
            >
              Powered by WAKTI
            </a>
          </div>
        </div>
      </div>

      {renderQrCodeFlip()}
      {renderMapDialog()}
      {renderCalendarDialog()}
    </div>
  );
};

export default LivePreview;
