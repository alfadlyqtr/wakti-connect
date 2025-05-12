
import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useCustomization } from '../context';

interface EventCardPreviewProps {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  locationTitle?: string;
}

const EventCardPreview: React.FC<EventCardPreviewProps> = ({
  title = "Event Title",
  description = "This is a description of your event. You can see how your customization choices affect the appearance here.",
  date = new Date(),
  location = "Event Location",
  locationTitle
}) => {
  const { customization } = useCustomization();

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Background style handling
  const getBackgroundStyle = () => {
    if (!customization?.background) {
      return { background: '#ffffff' };
    }

    if (customization.background.type === 'image' && customization.background.value) {
      return {
        backgroundImage: `url(${customization.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    return { background: customization.background.value || '#ffffff' };
  };

  // Font styles
  const getFontStyle = () => {
    return {
      fontFamily: customization?.font?.family || 'system-ui, sans-serif',
      color: customization?.font?.color || '#333333',
      fontSize: customization?.font?.size || 'medium'
    };
  };

  // Header style handling
  const renderHeader = () => {
    switch (customization?.headerStyle) {
      case 'banner':
        return (
          <div 
            className="mb-4 -mx-6 -mt-6 p-4 pt-8 pb-8"
            style={{ 
              background: 'rgba(0,0,0,0.1)', 
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              fontFamily: customization.headerFont?.family || customization.font?.family
            }}
          >
            <h2 className="text-2xl font-semibold text-center">{title}</h2>
            <p className="text-sm opacity-80 text-center mt-2">{formatDate(date)}</p>
          </div>
        );
        
      case 'minimal':
        return (
          <div 
            className="flex flex-col items-center mb-4"
            style={{ fontFamily: customization.headerFont?.family || customization.font?.family }}
          >
            <div className="w-12 h-12 bg-muted rounded-full mb-3 flex items-center justify-center">
              📅
            </div>
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="text-sm opacity-80">{formatDate(date)}</p>
          </div>
        );
        
      default:
        return (
          <div style={{ fontFamily: customization.headerFont?.family || customization.font?.family }}>
            <h2 className="text-2xl font-semibold mb-1">{title}</h2>
            <p className="text-sm opacity-80">{formatDate(date)}</p>
          </div>
        );
    }
  };

  // Button styles
  const getButtonStyles = (type: 'accept' | 'decline') => {
    const buttonConfig = customization?.buttons?.[type];
    return {
      background: buttonConfig?.background || (type === 'accept' ? '#4CAF50' : '#f44336'),
      color: buttonConfig?.color || '#ffffff',
      borderRadius: buttonConfig?.shape === 'pill' 
        ? '9999px' 
        : buttonConfig?.shape === 'square' 
          ? '0' 
          : '0.375rem'
    };
  };

  return (
    <Card 
      className="w-full overflow-hidden shadow-lg" 
      style={{ ...getBackgroundStyle(), ...getFontStyle(), padding: '1.5rem' }}
    >
      {renderHeader()}
      
      <div 
        className="mt-4" 
        style={{ fontFamily: customization.descriptionFont?.family || customization.font?.family }}
      >
        <p>{description}</p>
      </div>
      
      <div className="mt-4 text-sm opacity-70">
        {locationTitle ? (
          <div className="text-sm mt-2">
            <p className="font-medium">{locationTitle}</p>
            <p>{location}</p>
          </div>
        ) : (
          <p>Location: {location}</p>
        )}
      </div>
      
      {(customization?.showAcceptDeclineButtons !== false) && (
        <div className="flex gap-2 mt-6">
          <button 
            style={getButtonStyles('accept')}
            className="px-4 py-2 font-medium text-sm transition-colors"
          >
            Accept
          </button>
          <button 
            style={getButtonStyles('decline')}
            className="px-4 py-2 font-medium text-sm transition-colors"
          >
            Decline
          </button>
        </div>
      )}
    </Card>
  );
};

export default EventCardPreview;
