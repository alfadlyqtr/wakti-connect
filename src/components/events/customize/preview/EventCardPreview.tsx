
import React from 'react';
import { useCustomization } from '../context';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { formatLocation, generateMapsUrl, generateDirectionsUrl } from '@/utils/locationUtils';

interface EventCardPreviewProps {
  location?: string;
  locationTitle?: string;
}

const EventCardPreview = ({ location = '', locationTitle = '' }: EventCardPreviewProps) => {
  const { customization } = useCustomization();

  const getBackgroundStyle = () => {
    const { type, value } = customization.background;
    
    if (type === 'image') {
      return `url(${value})`;
    }
    return value || '#ffffff';
  };

  const cardStyle = {
    background: getBackgroundStyle(),
    color: customization.font.color,
    fontFamily: customization.font.family,
    fontSize: customization.font.size,
    padding: '2rem',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const formattedLocation = location ? formatLocation(location) : '';
  
  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (location) {
      window.open(generateMapsUrl(location), '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (location) {
      window.open(generateDirectionsUrl(location), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full p-4 bg-muted/50 rounded-lg">
      <h3 className="mb-4 text-sm font-medium">Live Preview</h3>
      <Card style={cardStyle} className="w-full shadow-lg">
        <div style={{ fontFamily: customization.headerFont?.family }}>
          <h2 className="text-2xl font-semibold">Sample Event Title</h2>
          <p className="text-sm opacity-80">Thursday, May 2nd 2024</p>
        </div>
        
        <div style={{ fontFamily: customization.descriptionFont?.family }} className="flex-1">
          <p>A preview of how your event card will appear to recipients.</p>
          
          {location && (
            <div className="mt-4">
              {locationTitle && (
                <div className="font-medium mb-1">{locationTitle}</div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-70">{formattedLocation}</span>
              </div>
            </div>
          )}
          
          {!location && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="opacity-70">
                {locationTitle || '1234 Main St, San Francisco, CA'}
              </span>
            </div>
          )}
        </div>

        {location && (
          <div className="flex gap-2 mt-2">
            <button 
              className="px-3 py-1.5 text-xs rounded flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: customization.font.color
              }}
              onClick={handleViewOnMap}
            >
              <MapPin className="h-3 w-3" />
              <span>View Map</span>
            </button>
            <button 
              className="px-3 py-1.5 text-xs rounded flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: customization.font.color
              }}
              onClick={handleGetDirections}
            >
              <Navigation className="h-3 w-3" />
              <span>Directions</span>
            </button>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button 
            style={{
              backgroundColor: customization.buttons.accept.background,
              color: customization.buttons.accept.color,
              borderRadius: customization.buttons.accept.shape === 'pill' ? '9999px' : '0.5rem'
            }}
            className="px-4 py-2 text-sm font-medium transition-colors"
          >
            Accept
          </button>
          <button 
            style={{
              backgroundColor: customization.buttons.decline.background,
              color: customization.buttons.decline.color,
              borderRadius: customization.buttons.decline.shape === 'pill' ? '9999px' : '0.5rem'
            }}
            className="px-4 py-2 text-sm font-medium transition-colors"
          >
            Decline
          </button>
        </div>
      </Card>
    </div>
  );
};

export default EventCardPreview;
