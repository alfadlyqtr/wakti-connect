import React from 'react';
import { Event } from '@/types/event.types';
import { Card } from '@/components/ui/card';
import { formatDateShort, formatTimeRange } from '@/utils/dateUtils';
import { formatLocation, generateMapsUrl } from '@/utils/locationUtils';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onCardClick?: () => void; // Added for compatibility with DashboardEvents
  onDelete?: (eventId: string) => Promise<void>;
  onEdit?: (event: Event) => void;
  onViewResponses?: (eventId: string) => void;
  onAccept?: (eventId: string) => Promise<void>;
  onDecline?: (eventId: string) => Promise<void>;
}

const EventCard = ({ 
  event, 
  onClick, 
  onCardClick,
  onDelete,
  onEdit,
  onViewResponses,
  onAccept,
  onDecline
}: EventCardProps) => {
  const { 
    title, 
    description, 
    start_time, 
    end_time,
    is_all_day,
    location,
    location_type,
    maps_url,
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

  const handleCardClick = onCardClick || onClick;

  const handleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = event.maps_url || (event.location && generateMapsUrl(event.location));
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formattedLocation = location ? formatLocation(location, location_type) : '';
  const hasLocation = Boolean(formattedLocation);

  return (
    <Card 
      className="p-4 cursor-pointer transition-all hover:shadow-lg"
      style={cardStyles}
      onClick={handleCardClick}
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
          
          {event.location && (
            <div className="mt-2 flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="line-clamp-1 text-sm">
                    {formatLocation(event.location)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-1 hover:bg-accent"
                    onClick={handleMapsClick}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
