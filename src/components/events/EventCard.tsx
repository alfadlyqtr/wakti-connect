import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, Share2, Edit, Clock, MoreHorizontal, Trash, Link, Copy, Check } from 'lucide-react';
import { formatDateString, formatTimeString } from '@/utils/dateTimeFormatter';
import { generateMapsUrl } from '@/utils/locationUtils';
import { Event } from '@/types/event.types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { deleteSimpleInvitation } from '@/services/invitation/simple-invitations';
import { toast } from '@/components/ui/use-toast';
import EventInvitationResponse from '@/components/events/EventInvitationResponse';

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  refreshEvents?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onShare, onDelete, refreshEvents }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
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

  // Generate a shareable link for the event
  const generateShareableLink = () => {
    const shareId = event.shareId || event.id;
    // Use the /i/:id format to match the route in publicRoutes.tsx
    const shareLink = `${window.location.origin}/i/${shareId}`;
    
    try {
      navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to your clipboard",
        variant: "success",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      });
    }
  };
  
  // Handle event deletion
  const handleDelete = async () => {
    if (!event.id) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteSimpleInvitation(event.id);
      
      if (success) {
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted",
          variant: "success",
        });
        
        // Call the onDelete callback if provided, otherwise refresh events
        if (onDelete) {
          onDelete();
        } else if (refreshEvents) {
          refreshEvents();
        }
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: "There was a problem deleting this event",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle response complete (optional callback for when a user responds to the invitation)
  const handleResponseComplete = () => {
    if (refreshEvents) {
      refreshEvents();
    }
  };
  
  return (
    <Card className="overflow-hidden" style={cardStyle}>
      <CardHeader className="pb-2 relative">
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateShareableLink}>
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Generate Link
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
      
      <CardFooter className="pt-2 flex flex-col gap-4">
        {/* Accept/Decline Invitation buttons */}
        <EventInvitationResponse 
          eventId={event.id} 
          eventTitle={event.title} 
          onResponseComplete={handleResponseComplete}
          className="w-full"
        />
        
        <div className="flex justify-between w-full">
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
