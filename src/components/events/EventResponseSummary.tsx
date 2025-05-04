
import React, { useEffect, useState } from 'react';
import { EventGuestResponse } from '@/types/event-guest-response.types';
import { fetchEventResponses } from '@/services/event/respondToInvitation';
import EventViewResponses from './EventViewResponses';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Users } from 'lucide-react';

interface EventResponseSummaryProps {
  eventId: string;
  isCreator?: boolean;
}

const EventResponseSummary: React.FC<EventResponseSummaryProps> = ({ 
  eventId, 
  isCreator = false
}) => {
  const [responses, setResponses] = useState<EventGuestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const loadResponses = async () => {
    if (!eventId) return;
    
    try {
      setIsLoading(true);
      console.log("EventResponseSummary: Loading responses for event", eventId);
      const eventResponses = await fetchEventResponses(eventId);
      console.log("EventResponseSummary: Received responses:", eventResponses);
      setResponses(eventResponses);
    } catch (err: any) {
      console.error("Error loading responses:", err);
      setError(err.message || "Failed to load responses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, [eventId]);

  // Don't show anything if there are no responses and user is not the creator
  if (!isCreator && responses.length === 0) {
    return null;
  }

  const acceptedCount = responses.filter(r => r.response === 'accepted').length;
  const declinedCount = responses.filter(r => r.response === 'declined').length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 gap-2 mt-2 rounded-full text-xs h-8 px-3"
          onClick={() => loadResponses()} // Refresh responses when opening the dialog
        >
          <Users className="h-3 w-3" /> 
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-400" /> {acceptedCount}
            <X className="h-3 w-3 ml-1 text-red-400" /> {declinedCount}
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <div className="p-2">
          {isLoading ? (
            <p className="text-center py-8">Loading responses...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : (
            <EventViewResponses responses={responses} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventResponseSummary;
