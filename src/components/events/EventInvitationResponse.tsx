import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { respondToInvitation } from '@/services/event/respondToInvitation';
import { useToast } from '@/components/ui/use-toast';
import NonWaktiUserPopup from './responses/NonWaktiUserPopup';

interface EventInvitationResponseProps {
  eventId: string;
  eventTitle: string;
  onResponseComplete?: () => void;
  className?: string;
}

const EventInvitationResponse: React.FC<EventInvitationResponseProps> = ({
  eventId,
  eventTitle,
  onResponseComplete,
  className = ''
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNonWaktiPopup, setShowNonWaktiPopup] = useState(false);
  const [responseType, setResponseType] = useState<'accepted' | 'declined'>('accepted');
  
  // Check if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await import('@/integrations/supabase/client').then(module => module.supabase.auth.getSession());
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleAccept = async () => {
    setResponseType('accepted');
    
    if (isAuthenticated === false) {
      setShowNonWaktiPopup(true);
      return;
    }
    
    try {
      setIsLoading(true);
      await respondToInvitation(eventId, 'accepted', { addToCalendar: true });
      if (onResponseComplete) onResponseComplete();
    } catch (error) {
      console.error("Error accepting invitation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDecline = async () => {
    setResponseType('declined');
    
    if (isAuthenticated === false) {
      setShowNonWaktiPopup(true);
      return;
    }
    
    try {
      setIsLoading(true);
      await respondToInvitation(eventId, 'declined');
      if (onResponseComplete) onResponseComplete();
    } catch (error) {
      console.error("Error declining invitation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNonWaktiSubmit = async (name: string) => {
    try {
      await respondToInvitation(eventId, responseType, { name });
      setShowNonWaktiPopup(false);
      if (onResponseComplete) onResponseComplete();
    } catch (error) {
      console.error(`Error ${responseType} invitation:`, error);
      toast({
        title: "Response Failed",
        description: "There was a problem saving your response. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className={`flex gap-3 ${className}`}>
        <Button
          variant="outline"
          className="flex-1 bg-green-50 hover:bg-green-100 border-green-200"
          disabled={isLoading}
          onClick={handleAccept}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Accept
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 bg-red-50 hover:bg-red-100 border-red-200"
          disabled={isLoading}
          onClick={handleDecline}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          Decline
        </Button>
      </div>
      
      <NonWaktiUserPopup
        isOpen={showNonWaktiPopup}
        onClose={() => setShowNonWaktiPopup(false)}
        onSubmit={handleNonWaktiSubmit}
        type={responseType}
        eventTitle={eventTitle}
      />
    </>
  );
};

export default EventInvitationResponse;
