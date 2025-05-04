
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
  
  const handleAccept = () => {
    setResponseType('accepted');
    setShowNonWaktiPopup(true);
  };
  
  const handleDecline = () => {
    setResponseType('declined');
    setShowNonWaktiPopup(true);
  };
  
  const handleNonWaktiSubmit = async (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Add console log to debug the eventId
      console.log("Submitting response with eventId:", eventId, "type:", typeof eventId);
      
      const result = await respondToInvitation(eventId, responseType, { name });
      
      if (result.success) {
        toast({
          title: "Response Recorded",
          description: responseType === 'accepted' 
            ? `Thank you for accepting, ${name}!` 
            : `We're sorry you can't make it, ${name}.`,
          variant: responseType === 'accepted' ? "success" : "default"
        });
        
        // Close popup
        setShowNonWaktiPopup(false);
        
        // Call the callback
        if (onResponseComplete) onResponseComplete();
      } else {
        throw new Error(result.error || "Failed to record response");
      }
    } catch (error: any) {
      console.error(`Error ${responseType} invitation:`, error);
      toast({
        title: "Response Failed",
        description: `There was a problem saving your response: ${error.message || "Please try again."}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`flex gap-3 ${className}`}>
        <Button
          variant="default"
          className="flex-1 bg-green-600/40 hover:bg-green-700/60 text-white font-medium py-6 h-12 rounded-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center backdrop-blur-sm"
          disabled={isLoading}
          onClick={handleAccept}
        >
          <ThumbsUp className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Accept</span>
        </Button>
        
        <Button
          variant="default"
          className="flex-1 bg-red-500/40 hover:bg-red-600/60 text-white font-medium py-6 h-12 rounded-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center backdrop-blur-sm"
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
        isSubmitting={isLoading}
      />
    </>
  );
};

export default EventInvitationResponse;
