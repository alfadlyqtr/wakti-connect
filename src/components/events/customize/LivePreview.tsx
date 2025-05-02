
import React from 'react';
import { EventCustomization } from '@/types/event.types';
import { Card } from '@/components/ui/card';
import { generateDirectionsUrl } from '@/utils/locationUtils';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LivePreviewProps {
  customization: EventCustomization;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  locationTitle?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  customization,
  title = "Sample Event Title",
  description = "This is a sample description for your event. It shows how content will appear.",
  date = "May 15, 2023 • 3:00 PM",
  location = "Sample Location",
  locationTitle
}) => {
  const getBackgroundStyle = () => {
    if (!customization?.background) {
      return '#ffffff';
    }

    const { type, value } = customization.background;
    
    if (type === 'image') {
      return `url(${value})`;
    }
    
    return value || '#ffffff';
  };

  // Determine if we need text shadow based on background
  const needsTextShadow = () => {
    // If textShadow is explicitly set, use that
    if (customization.textShadow !== undefined) {
      return customization.textShadow;
    }
    
    // Otherwise determine based on background type
    if (customization.background?.type === 'image') {
      return true;
    }
    return false;
  };

  const textShadowStyle = needsTextShadow() ? 
    { textShadow: '0 1px 2px rgba(0,0,0,0.7)' } : {};

  const cardStyle = {
    background: getBackgroundStyle(),
    color: customization.font?.color || '#333333',
    fontFamily: customization.font?.family || 'system-ui, sans-serif',
    fontSize: customization.font?.size || 'medium',
    padding: '2rem',
    minHeight: '500px',
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
    position: 'relative' as const,
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Apply header style according to customization
  const renderHeader = () => {
    const headerTextStyle = {
      ...textShadowStyle,
      fontFamily: customization.headerFont?.family
    };
    
    switch(customization.headerStyle) {
      case 'banner':
        return (
          <div className="mb-4 -mx-8 -mt-8 p-4 pt-6 pb-6" 
               style={{ 
                 background: 'rgba(0,0,0,0.1)', 
                 borderBottom: '1px solid rgba(0,0,0,0.05)',
               }}>
            <h2 className="text-2xl font-semibold text-center" style={headerTextStyle}>{title}</h2>
            <p className="text-sm opacity-80 text-center" style={headerTextStyle}>{date}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
              📅
            </div>
            <h2 className="text-xl font-medium" style={headerTextStyle}>{title}</h2>
            <p className="text-sm opacity-80" style={headerTextStyle}>{date}</p>
          </div>
        );
      case 'simple':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold" style={headerTextStyle}>{title}</h2>
            <p className="text-sm opacity-80" style={headerTextStyle}>{date}</p>
          </div>
        );
    }
  };

  // Handle directions button click
  const handleGetDirections = () => {
    if (location) {
      const directionsUrl = generateDirectionsUrl(location);
      window.open(directionsUrl, '_blank');
    }
  };

  // Get map display style
  const renderMapSection = () => {
    if (!location) return null;

    const mapDisplay = customization.mapDisplay || 'both';

    switch (mapDisplay) {
      case 'qrcode':
        return (
          <div className="mt-4">
            <p className="text-sm mb-2 opacity-70" style={textShadowStyle}>Scan for directions:</p>
            <div className="w-24 h-24 bg-white border rounded flex items-center justify-center">
              QR Placeholder
            </div>
          </div>
        );
      case 'both': 
        return (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGetDirections}
              className="flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              <span>Get Directions</span>
            </Button>
          </div>
        );
      case 'button':
      default:
        return (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGetDirections}
              className="flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              <span>Get Directions</span>
            </Button>
          </div>
        );
    }
  };

  return (
    <Card style={cardStyle} className="w-full shadow-lg">
      {renderHeader()}
      
      <div style={{ ...textShadowStyle, fontFamily: customization.descriptionFont?.family }} className="flex-1">
        <p>{description}</p>
        {locationTitle ? (
          <div className="text-sm mt-2 opacity-70">
            <p className="font-medium">{locationTitle}</p>
            <p>{location}</p>
          </div>
        ) : (
          <p className="text-sm mt-2 opacity-70">Location: {location}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 justify-between">
        {renderMapSection()}
        
        {customization.showAcceptDeclineButtons !== false && (
          <div className="flex gap-2">
            <button 
              style={{
                backgroundColor: customization.buttons?.accept?.background || '#4CAF50',
                color: customization.buttons?.accept?.color || '#ffffff',
                borderRadius: customization.buttons?.accept?.shape === 'pill' ? '9999px' : '0.5rem',
                ...textShadowStyle
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              Accept
            </button>
            <button 
              style={{
                backgroundColor: customization.buttons?.decline?.background || '#f44336',
                color: customization.buttons?.decline?.color || '#ffffff',
                borderRadius: customization.buttons?.decline?.shape === 'pill' ? '9999px' : '0.5rem',
                ...textShadowStyle
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LivePreview;
