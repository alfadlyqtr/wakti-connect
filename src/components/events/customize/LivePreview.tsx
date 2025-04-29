
import React from 'react';
import { EventCustomization } from '@/types/event.types';
import { Card } from '@/components/ui/card';

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

  const cardStyle = {
    background: getBackgroundStyle(),
    color: customization.font?.color || '#333333',
    fontFamily: customization.font?.family || 'system-ui, sans-serif',
    fontSize: customization.font?.size || 'medium',
    padding: '2rem',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    position: 'relative' as const,
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
                 fontFamily: customization.headerFont?.family
               }}>
            <h2 className="text-2xl font-semibold text-center">{title}</h2>
            <p className="text-sm opacity-80 text-center">{date}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center mb-4" 
               style={{ fontFamily: customization.headerFont?.family }}>
            <div className="w-12 h-12 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
              📅
            </div>
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="text-sm opacity-80">{date}</p>
          </div>
        );
      case 'simple':
      default:
        return (
          <div style={{ fontFamily: customization.headerFont?.family }}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm opacity-80">{date}</p>
          </div>
        );
    }
  };

  return (
    <Card style={cardStyle} className="w-full shadow-lg">
      {renderHeader()}
      
      <div style={{ fontFamily: customization.descriptionFont?.family }} className="flex-1">
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
  );
};

export default LivePreview;
