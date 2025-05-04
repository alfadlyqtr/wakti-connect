
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
      toast({
        title: "Response Saved",
        description: "You have accepted this invitation.",
        variant: "default"
      });
      if (onResponseComplete) onResponseComplete();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Response Saved",
        description: "You have declined this invitation.",
        variant: "default"
      });
      if (onResponseComplete) onResponseComplete();
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        title: "Error",
        description: "Failed to decline invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNonWaktiSubmit = async (name: string) => {
    try {
      await respondToInvitation(eventId, responseType, { name });
      setShowNonWaktiPopup(false);
      toast({
        title: "Response Saved",
        description: `You have ${responseType === 'accepted' ? 'accepted' : 'declined'} this invitation.`,
        variant: "default"
      });
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
          variant="default"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-6 h-12 rounded-md shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center"
          disabled={isLoading}
          onClick={handleAccept}
        >
          <ThumbsUp className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Accept</span>
        </Button>
        
        <Button
          variant="default"
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-6 h-12 rounded-md shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center"
          disabled={isLoading}
          onClick={handleDecline}
        >
          <ThumbsDown className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Decline</span>
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
