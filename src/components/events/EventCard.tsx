
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Share2, Edit, Clock } from 'lucide-react';
import { formatDateString, formatTimeString } from '@/utils/dateTimeFormatter';
import { generateMapsUrl } from '@/utils/locationUtils';
import { Event } from '@/types/event.types';

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onShare?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onShare }) => {
  const hasLocation = !!event.location;
  const startDate = event.start_time ? new Date(event.start_time) : null;
  const endDate = event.end_time ? new Date(event.end_time) : null;
  
  // Get custom styling from event with default values if customization is missing
  const customization = event.customization || {};
  const background = customization.background || { type: 'solid', value: '#ffffff' };
  const textColor = customization.font?.color || '#000000';
  
  // Generate background style
  const cardStyle: React.CSSProperties = {
    color: textColor,
  };
  
  if (background.type === 'solid') {
    cardStyle.backgroundColor = background.value;
  } else if (background.type === 'image' && background.value) {
    cardStyle.backgroundImage = `url(${background.value})`;
    cardStyle.backgroundSize = 'cover';
    cardStyle.backgroundPosition = 'center';
    cardStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Darken the image a bit
    cardStyle.color = '#ffffff'; // Default text color on images
  }
  
  // Format dates for display
  const formattedStartDate = startDate ? formatDateString(startDate.toISOString()) : '';
  const formattedStartTime = startDate && !event.is_all_day ? formatTimeString(startDate.toISOString()) : '';
  
  return (
    <Card className="overflow-hidden" style={cardStyle}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <div className="flex items-center text-sm space-x-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedStartDate}</span>
          {formattedStartTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mx-1" />
              <span>{formattedStartTime}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {event.description && (
          <p className="text-sm mb-3">{event.description}</p>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-2">
            <Map className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {event.location_title || event.location}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          {hasLocation && event.location && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(generateMapsUrl(event.location), '_blank')}
              className="text-xs h-8"
            >
              Get Directions
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button 
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {onShare && (
            <Button 
              size="sm"
              variant="ghost"
              onClick={onShare}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
