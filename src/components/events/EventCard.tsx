import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Share2, Edit, Clock, MapPin, MoreVertical } from 'lucide-react';
import { formatDateString, formatTimeString } from '@/utils/dateTimeFormatter';
import { generateMapsUrl } from '@/utils/locationUtils';
import { Event } from '@/types/event.types';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onShare, onDelete }) => {
  const hasLocation = !!event.location;
  const startDate = event.start_time ? new Date(event.start_time) : null;
  const endDate = event.end_time ? new Date(event.end_time) : null;
  
  // Get custom styling from event with default values if customization is missing
  const customization = event.customization || {
    background: { type: 'solid', value: '#ffffff' },
    font: { color: '#000000' }
  };
  
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
  
  // Determine if we need text shadow based on background
  const needsTextShadow = () => {
    // If textShadow is explicitly set, use that
    if (customization.textShadow !== undefined) {
      return customization.textShadow;
    }
    
    // Otherwise determine based on background type
    if (background.type === 'image') {
      return true;
    }
    return false;
  };

  const textShadowStyle = needsTextShadow() ? 
    { textShadow: '0 1px 2px rgba(0,0,0,0.7)' } : {};
  
  return (
    <Card className="overflow-hidden" style={cardStyle}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold" style={textShadowStyle}>{event.title}</h3>
          
          {/* Add dropdown menu for actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center text-sm space-x-1" style={textShadowStyle}>
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
          <p className="text-sm mb-3" style={textShadowStyle}>{event.description}</p>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm mt-2" style={textShadowStyle}>
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
              onClick={() => window.open(generateMapsUrl(event.location || ''), '_blank')}
              className="text-xs h-8 flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              Get Directions
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {customization.showAddToCalendarButton !== false && (
            <Button 
              size="sm"
              variant="outline"
              className="text-xs h-8"
            >
              Add to Calendar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
