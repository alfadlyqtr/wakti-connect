
import React from 'react';
import { Event, EventCustomization } from '@/types/event.types';
import { Card } from '@/components/ui/card';
import { formatDateShort, formatTimeRange } from '@/utils/dateUtils';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const { 
    title, 
    description, 
    start_time, 
    end_time,
    is_all_day,
    location,
    customization 
  } = event;
  
  // Extract the date from start_time
  const date = start_time ? new Date(start_time) : new Date();
  const formattedDate = formatDateShort(date);
  
  // Format the time range
  const timeDisplay = is_all_day 
    ? "All day" 
    : formatTimeRange(new Date(start_time), new Date(end_time));

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

  const fontColor = customization?.font?.color || '#333333';
  const fontFamily = customization?.font?.family || 'system-ui, sans-serif';

  const cardStyles = {
    background: getBackgroundStyle(),
    color: fontColor,
    fontFamily,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <Card 
      className="p-4 cursor-pointer transition-all hover:shadow-lg"
      style={cardStyles}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          {description && (
            <p className="text-sm opacity-80 line-clamp-2 mt-1">{description}</p>
          )}
        </div>
        
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <span className="font-medium">{formattedDate}</span>
            <span>•</span>
            <span>{timeDisplay}</span>
          </div>
          
          {location && (
            <div className="mt-1 line-clamp-1 text-sm opacity-70">
              {location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
