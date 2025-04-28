import React from 'react';
import { useCustomization } from '../context';
import { Card } from '@/components/ui/card';

const EventCardPreview = () => {
  const { customization } = useCustomization();

  const getBackgroundStyle = () => {
    const { type, value } = customization.background;
    
    if (type === 'gradient') {
      // Support both advanced gradients and legacy format
      if (value.includes('noise') || value.startsWith('radial-gradient')) {
        return value;
      }
      return value || `linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 100%)`;
    } else if (type === 'image') {
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
          <p className="text-sm mt-2 opacity-70">Location: Sample Venue</p>
        </div>

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
