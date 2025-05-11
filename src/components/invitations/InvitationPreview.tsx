
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Share2, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import EventResponseSummary from '@/components/events/EventResponseSummary';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { SimpleInvitationCustomization } from '@/types/invitation.types';

interface InvitationPreviewProps {
  title: string;
  description: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  customization?: SimpleInvitationCustomization;
  isEvent?: boolean;
  showActions?: boolean;
  eventId?: string;
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  title,
  description,
  location,
  locationTitle,
  date,
  time,
  customization,
  isEvent = false,
  showActions = false,
  eventId,
}) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Function to determine if the invitation has a location
  const hasLocation = !!location;

  // Function to format the date and time
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error parsing date:", error);
      return '';
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    try {
      const parsedDate = parseISO(timeString);
      return format(parsedDate, 'h:mm a');
    } catch (error) {
      console.error("Error parsing time:", error);
      return '';
    }
  };

  // Apply customization styles
  const cardStyle: React.CSSProperties = {
    color: customization?.font?.color || '#000000',
    width: '100%',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
  };

  if (customization?.background?.type === 'solid') {
    cardStyle.backgroundColor = customization?.background?.value || '#ffffff';
  } else if (customization?.background?.type === 'image' && customization?.background?.value) {
    cardStyle.backgroundImage = `url(${customization.background.value})`;
    cardStyle.backgroundSize = 'cover';
    cardStyle.backgroundPosition = 'center';
    cardStyle.color = '#ffffff';
  } else {
    cardStyle.backgroundColor = '#ffffff';
  }

  return (
    <Card className="overflow-hidden shadow-md" style={cardStyle}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center text-sm space-x-1">
          {date && (
            <>
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(date)}</span>
            </>
          )}
          {time && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mx-1" />
              <span>{formatTime(time)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm mb-3">{description}</p>

        {hasLocation && (
          <div className="flex items-center text-sm mt-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{locationTitle || location}</span>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="pt-2 flex justify-between items-center mt-auto">
          <div className="flex space-x-2">
            {isEvent && eventId && (
              <EventResponseSummary eventId={eventId} />
            )}
          </div>

          <DropdownMenu open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs h-8">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    text: description,
                    url: window.location.href,
                  }).then(() => console.log('Successful share'))
                    .catch((error) => console.error('Error sharing', error));
                } else {
                  toast({
                    title: 'Web Share API not supported',
                    description: 'Please copy the link manually.',
                  });
                }
                setIsShareMenuOpen(false);
              }}>
                Share via Web Share API
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: 'Link copied to clipboard',
                });
                setIsShareMenuOpen(false);
              }}>
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      )}
    </Card>
  );
};

export default InvitationPreview;
