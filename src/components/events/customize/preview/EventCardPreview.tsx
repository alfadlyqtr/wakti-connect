
import React from 'react';
import { useCustomization } from '../context';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Calendar } from 'lucide-react';
import { formatLocation, generateMapsUrl, generateDirectionsUrl } from '@/utils/locationUtils';
import { format } from 'date-fns';

interface EventCardPreviewProps {
  location?: string;
  locationTitle?: string;
  title?: string;
  description?: string;
  date?: Date;
}

const EventCardPreview = ({ 
  location = '', 
  locationTitle = '',
  title = 'Sample Event Title',
  description = 'This is a sample description for your event. It shows how content will appear.',
  date = new Date()
}: EventCardPreviewProps) => {
  const { customization } = useCustomization();

  const getBackgroundStyle = () => {
    const { type, value } = customization.background;
    
    if (type === 'image') {
      return `url(${value})`;
    }
    return value || '#ffffff';
  };

  const formattedDate = date ? format(date, 'EEEE, MMMM do yyyy') : 'Thursday, May 2nd 2024';

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
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
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

  // Apply header style according to customization
  const renderHeader = () => {
    switch(customization.headerStyle) {
      case 'banner':
        return (
          <div className="mb-4 -mx-8 -mt-8 p-4 pt-6 pb-6" 
               style={{ 
                 background: 'rgba(0,0,0,0.1)', 
                 borderBottom: '1px solid rgba(0,0,0,0.05)',
                 fontFamily: customization.headerFont?.family,
                 color: customization.headerFont?.color || customization.font.color
               }}>
            <h2 className="text-2xl font-semibold text-center">{title}</h2>
            <p className="text-sm opacity-80 text-center">{formattedDate}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center mb-4" 
               style={{ 
                 fontFamily: customization.headerFont?.family,
                 color: customization.headerFont?.color || customization.font.color
               }}>
            <div className="w-12 h-12 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="text-sm opacity-80">{formattedDate}</p>
          </div>
        );
      case 'simple':
      default:
        return (
          <div style={{ 
            fontFamily: customization.headerFont?.family,
            color: customization.headerFont?.color || customization.font.color
          }}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm opacity-80">{formattedDate}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full p-4 bg-muted/50 rounded-lg">
      <h3 className="mb-4 text-sm font-medium">Live Preview</h3>
      <Card style={cardStyle} className="w-full shadow-lg">
        {renderHeader()}
        
        <div style={{ 
          fontFamily: customization.descriptionFont?.family,
          color: customization.descriptionFont?.color || customization.font.color
        }} className="flex-1">
          <p>{description}</p>
          
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

        {location && customization.mapDisplay === 'both' && (
          <div className="mt-2 bg-gray-100 rounded-lg h-24 flex items-center justify-center">
            <div className="text-sm text-gray-500">Map Preview</div>
          </div>
        )}

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

        {customization.showAcceptDeclineButtons !== false && (
          <div className="flex gap-2 mt-4">
            <button 
              style={{
                backgroundColor: customization.buttons?.accept?.background || '#4CAF50',
                color: customization.buttons?.accept?.color || '#ffffff',
                borderRadius: customization.buttons?.accept?.shape === 'pill' ? '9999px' : '0.5rem'
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              Accept
            </button>
            <button 
              style={{
                backgroundColor: customization.buttons?.decline?.background || '#f44336',
                color: customization.buttons?.decline?.color || '#ffffff',
                borderRadius: customization.buttons?.decline?.shape === 'pill' ? '9999px' : '0.5rem'
              }}
              className="px-4 py-2 text-sm font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventCardPreview;
