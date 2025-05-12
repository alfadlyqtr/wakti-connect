
import React, { useEffect, useState } from 'react';
import { Event, EventCustomization } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { transformDatabaseEvent } from '@/services/event/eventHelpers';
import { toast } from '@/components/ui/use-toast';

interface ViewEventPageProps {
  eventId: string;
}

const ViewEventPage: React.FC<ViewEventPageProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          setError('Failed to load event');
          console.error('Error loading event:', error);
          return;
        }

        if (!data) {
          setError('Event not found');
          return;
        }

        // Transform the database event to our frontend Event type
        const transformedEvent = transformDatabaseEvent(data);
        setEvent(transformedEvent);
      } catch (err) {
        console.error('Error in fetchEvent:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <div className="p-4">Loading event...</div>;
  }

  if (error || !event) {
    return <div className="p-4 text-red-500">{error || 'Failed to load event data'}</div>;
  }

  // Safely access customization with defaults
  const customization = event.customization || {};
  const backgroundType = customization.background?.type || 'solid';
  const backgroundColor = customization.background?.value || '#ffffff';
  const backgroundStyle = backgroundType === 'image' 
    ? { backgroundImage: `url(${backgroundColor})`, backgroundSize: 'cover' }
    : { backgroundColor };

  const fontFamily = customization.font?.family || 'system-ui, sans-serif';
  const fontSize = customization.font?.size || 'medium';
  const fontColor = customization.font?.color || '#333333';

  // Format date for display
  const eventDate = new Date(event.start_time);
  const formattedDate = format(eventDate, 'PPPP');
  const formattedTime = event.is_all_day 
    ? 'All day' 
    : `${format(new Date(event.start_time), 'h:mm a')} - ${format(new Date(event.end_time), 'h:mm a')}`;

  // Determine button styles
  const acceptButtonStyle = {
    backgroundColor: customization.buttons?.accept?.background || '#4CAF50',
    color: customization.buttons?.accept?.color || 'white',
    borderRadius: customization.buttons?.accept?.shape === 'pill' ? '9999px' : '0.375rem'
  };

  const declineButtonStyle = {
    backgroundColor: customization.buttons?.decline?.background || '#f44336',
    color: customization.buttons?.decline?.color || 'white',
    borderRadius: customization.buttons?.decline?.shape === 'pill' ? '9999px' : '0.375rem'
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="p-6" style={{ ...backgroundStyle, color: fontColor, fontFamily }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-sm opacity-75">Hosted by {event.sender_name || 'Event Organizer'}</p>
          </div>
          
          <div className="mb-6">
            <div className="mb-2">
              <span className="font-medium">When:</span> {formattedDate}
            </div>
            <div className="mb-2">
              <span className="font-medium">Time:</span> {formattedTime}
            </div>
            {event.location && (
              <div className="mb-2">
                <span className="font-medium">Where:</span> {event.location}
                {event.location_title && (
                  <div className="text-sm ml-6">{event.location_title}</div>
                )}
              </div>
            )}
          </div>
          
          {event.description && (
            <div className="mb-6">
              <div className="font-medium">Description:</div>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
          
          <div className="mt-8 flex gap-4">
            <button style={acceptButtonStyle} className="px-4 py-2 font-medium">
              Accept
            </button>
            <button style={declineButtonStyle} className="px-4 py-2 font-medium">
              Decline
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewEventPage;
