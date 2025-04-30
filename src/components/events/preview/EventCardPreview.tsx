
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { EVENT_CARD_DIMENSIONS } from '@/types/eventCustomization';
import { EventCustomization } from '@/types/event.types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface EventCardPreviewProps {
  customization: EventCustomization;
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  locationTitle?: string;
}

const EventCardPreview: React.FC<EventCardPreviewProps> = ({
  customization,
  title = "My Amazing Event",
  description = "Join us for an unforgettable event. Add more details about what to expect and any special instructions for attendees.",
  date = new Date(),
  location = "123 Main St, Anytown, USA",
  locationTitle
}) => {
  const [zoom, setZoom] = useState(1);
  
  // Format the date for preview
  const formattedDate = date ? format(date, "MMMM d, yyyy • h:mm a") : "Date & Time TBD";
  
  const getBackgroundStyle = () => {
    if (!customization?.background) {
      return { backgroundColor: '#ffffff' };
    }

    const { type, value } = customization.background;
    
    if (type === 'image' && value) {
      return { 
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    return { backgroundColor: value || '#ffffff' };
  };

  // Card style based on customization settings
  const cardStyle: React.CSSProperties = {
    ...getBackgroundStyle(),
    color: customization.font?.color || '#333333',
    fontFamily: customization.font?.family || 'system-ui, sans-serif',
    padding: '1.5rem',
    width: `${EVENT_CARD_DIMENSIONS.PIXELS.WIDTH}px`,
    height: `${EVENT_CARD_DIMENSIONS.PIXELS.HEIGHT}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    position: 'relative',
    overflow: 'hidden',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    transitionProperty: 'transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
  };

  // Container style with responsive scaling
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: String(EVENT_CARD_DIMENSIONS.PHYSICAL.ASPECT_RATIO)
  };
  
  const zoomIncrements = 0.25;
  const minZoom = 0.5;
  const maxZoom = 2;
  
  const handleZoomIn = () => {
    setZoom(Math.min(maxZoom, zoom + zoomIncrements));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(minZoom, zoom - zoomIncrements));
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };

  // Apply header style according to customization
  const renderHeader = () => {
    const headerStyle = {
      fontFamily: customization.headerFont?.family || 'system-ui, sans-serif',
      color: customization.headerFont?.color || customization.font?.color,
      fontWeight: customization.headerFont?.weight || 'bold',
    };

    switch(customization.headerStyle) {
      case 'banner':
        return (
          <div className="mb-2 -mx-6 -mt-6 p-3 pt-4 pb-4" 
               style={{ 
                 background: 'rgba(0,0,0,0.1)', 
                 borderBottom: '1px solid rgba(0,0,0,0.05)',
                 ...headerStyle
               }}>
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            <p className="text-xs opacity-80 text-center">{formattedDate}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center mb-2" 
               style={headerStyle}>
            <div className="w-10 h-10 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
              📅
            </div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-xs opacity-80">{formattedDate}</p>
          </div>
        );
      case 'simple':
      default:
        return (
          <div style={headerStyle}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-xs opacity-80">{formattedDate}</p>
          </div>
        );
    }
  };
  
  // Apply description style according to customization
  const descriptionStyle = {
    fontFamily: customization.descriptionFont?.family || customization.font?.family,
    color: customization.descriptionFont?.color || customization.font?.color,
    fontSize: customization.descriptionFont?.size || customization.font?.size
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      
      <div className="rounded-lg border overflow-hidden">
        <div className="flex justify-end gap-1 p-1 bg-muted">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            disabled={zoom <= minZoom}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleResetZoom}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            disabled={zoom >= maxZoom}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div 
          className="overflow-auto p-4 bg-muted/30" 
          style={{
            maxHeight: '500px',
            maxWidth: '100%'
          }}
        >
          <div style={containerStyle}>
            <Card style={cardStyle} className="shadow-lg">
              {renderHeader()}
              
              <div 
                style={descriptionStyle} 
                className="flex-1 text-sm"
              >
                <p>{description}</p>
                {locationTitle ? (
                  <div className="text-xs mt-2 opacity-70">
                    <p className="font-medium">{locationTitle}</p>
                    <p>{location}</p>
                  </div>
                ) : (
                  <p className="text-xs mt-2 opacity-70">Location: {location}</p>
                )}
              </div>

              {/* Accept and Decline buttons */}
              {customization.showAcceptDeclineButtons !== false && (
                <div className="flex gap-2 mt-2">
                  <button 
                    style={{
                      backgroundColor: customization.buttons?.accept?.background || '#4CAF50',
                      color: customization.buttons?.accept?.color || '#ffffff',
                      borderRadius: customization.buttons?.accept?.shape === 'pill' ? '9999px' : '0.5rem'
                    }}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    style={{
                      backgroundColor: customization.buttons?.decline?.background || '#f44336',
                      color: customization.buttons?.decline?.color || '#ffffff',
                      borderRadius: customization.buttons?.decline?.shape === 'pill' ? '9999px' : '0.5rem'
                    }}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Card Dimensions</h4>
        <p className="text-xs text-muted-foreground">
          5.78" × 2.82" ({EVENT_CARD_DIMENSIONS.PIXELS.WIDTH}px × {EVENT_CARD_DIMENSIONS.PIXELS.HEIGHT}px)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Zoom: {(zoom * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default EventCardPreview;
