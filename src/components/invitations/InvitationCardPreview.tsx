
import React from 'react';
import { Card } from '@/components/ui/card';
import { SimpleInvitationCustomization, ButtonPosition } from '@/types/invitation.types';

interface InvitationCardPreviewProps {
  customization: SimpleInvitationCustomization;
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  hasLocation?: boolean;
  isEvent?: boolean;
}

export default function InvitationCardPreview({
  customization,
  title = "Your Invitation Title",
  description = "This is where your invitation description will appear. Add all the important details about your event here.",
  location = "Location details will appear here",
  date = "June 15, 2023",
  hasLocation = false,
  isEvent = false
}: InvitationCardPreviewProps) {
  
  const getBackgroundStyle = () => {
    const { type, value } = customization.background;
    
    if (type === 'image' && value) {
      return {
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    if (type === 'gradient' && value) {
      return { background: value };
    }
    
    return { backgroundColor: value || '#ffffff' };
  };
  
  const getButtonPositionStyle = (position: ButtonPosition) => {
    switch(position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-right':
        return 'top-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };
  
  const getContentPositionStyle = () => {
    const contentPosition = customization.textLayout?.contentPosition || 'middle';
    
    switch(contentPosition) {
      case 'top':
        return 'justify-start pt-6';
      case 'middle':
        return 'justify-center';
      case 'bottom':
        return 'justify-end pb-6';
      default:
        return 'justify-center';
    }
  };
  
  const getContentSpacingStyle = () => {
    const spacing = customization.textLayout?.spacing || 'normal';
    
    switch(spacing) {
      case 'compact':
        return 'gap-2';
      case 'normal':
        return 'gap-4';
      case 'spacious':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };
  
  return (
    <Card className="overflow-hidden w-full shadow-lg relative" style={{
      ...getBackgroundStyle(),
      height: '340px',
      color: customization.font.color || '#000000',
      fontFamily: customization.font.family || 'system-ui, sans-serif',
    }}>
      <div className={`flex flex-col h-full px-4 ${getContentPositionStyle()} ${getContentSpacingStyle()}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ 
            textAlign: customization.font.alignment || 'center',
            fontWeight: customization.font.weight || 'bold',
          }}>
            {title}
          </h2>
          
          {date && (
            <p className="text-sm mt-1 opacity-75">{date}</p>
          )}
          
          <p className="mt-2" style={{ 
            textAlign: customization.font.alignment || 'center',
          }}>
            {description}
          </p>
          
          {hasLocation && (
            <p className="text-sm mt-2 opacity-75">{location}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {hasLocation && customization.buttons?.directions?.show && (
        <button
          className={`absolute ${getButtonPositionStyle(customization.buttons.directions.position || 'bottom-right')} text-xs px-2 py-1`}
          style={{
            backgroundColor: customization.buttons.directions.background || '#ffffff',
            color: customization.buttons.directions.color || '#000000',
            borderRadius: customization.buttons.directions.shape === 'pill' ? '9999px' : 
                         customization.buttons.directions.shape === 'square' ? '0px' : '4px',
          }}
        >
          Get Directions
        </button>
      )}
      
      {isEvent && customization.buttons?.calendar?.show && (
        <button
          className={`absolute ${getButtonPositionStyle(customization.buttons.calendar.position || 'bottom-right')} text-xs px-2 py-1`}
          style={{
            backgroundColor: customization.buttons.calendar.background || '#ffffff',
            color: customization.buttons.calendar.color || '#000000',
            borderRadius: customization.buttons.calendar.shape === 'pill' ? '9999px' : 
                         customization.buttons.calendar.shape === 'square' ? '0px' : '4px',
          }}
        >
          Add to Calendar
        </button>
      )}
    </Card>
  );
}
