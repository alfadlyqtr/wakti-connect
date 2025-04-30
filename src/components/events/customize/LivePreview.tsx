
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

// Card dimensions: 5.78" x 2.82"
// Converting inches to pixels using standard 96 DPI: 1 inch = 96px
// This gives us: 554.88px x 270.72px
// We'll round to 555px x 271px
const CARD_WIDTH_PX = 555;
const CARD_HEIGHT_PX = 271;

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
    padding: '1.5rem',
    // Use exact dimensions for the card
    width: `${CARD_WIDTH_PX}px`,
    height: `${CARD_HEIGHT_PX}px`,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    position: 'relative' as const,
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // Set a max-width and max-height to ensure the card is responsive
    maxWidth: '100%',
    maxHeight: '100%',
  };

  // Responsive container style
  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  // Apply header style according to customization
  const renderHeader = () => {
    switch(customization.headerStyle) {
      case 'banner':
        return (
          <div className="mb-2 -mx-6 -mt-6 p-3 pt-4 pb-4" 
               style={{ 
                 background: 'rgba(0,0,0,0.1)', 
                 borderBottom: '1px solid rgba(0,0,0,0.05)',
                 fontFamily: customization.headerFont?.family
               }}>
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            <p className="text-xs opacity-80 text-center">{date}</p>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex flex-col items-center mb-2" 
               style={{ fontFamily: customization.headerFont?.family }}>
            <div className="w-10 h-10 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
              📅
            </div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-xs opacity-80">{date}</p>
          </div>
        );
      case 'simple':
      default:
        return (
          <div style={{ fontFamily: customization.headerFont?.family }}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-xs opacity-80">{date}</p>
          </div>
        );
    }
  };

  return (
    <div style={containerStyle} className="preview-container">
      <Card style={cardStyle} className="shadow-lg scale-[0.95] sm:scale-100 transform-gpu">
        {renderHeader()}
        
        <div style={{ fontFamily: customization.descriptionFont?.family }} className="flex-1 text-sm">
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
  );
};

export default LivePreview;
