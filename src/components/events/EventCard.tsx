import React from 'react';
import { Event } from '@/types/event.types';
import { Card } from '@/components/ui/card';
import { formatDateShort, formatTimeRange } from '@/utils/dateUtils';
import { formatLocation, generateMapsUrl, generateDirectionsUrl } from '@/utils/locationUtils';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onCardClick?: () => void;
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
  
  const date = start_time ? new Date(start_time) : new Date();
  const formattedDate = formatDateShort(date);
  
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

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.location) {
      const url = event.maps_url || generateMapsUrl(event.location);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.location) {
      const url = generateDirectionsUrl(event.location);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formattedLocation = event.location ? formatLocation(event.location) : '';
  const handleCardClick = onCardClick || onClick;
  
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
            <div className="mt-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-1">
                    {formattedLocation}
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs flex gap-1 items-center"
                      onClick={handleViewOnMap}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>View Map</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs flex gap-1 items-center"
                      onClick={handleGetDirections}
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Directions</span>
                    </Button>
                  </div>
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
