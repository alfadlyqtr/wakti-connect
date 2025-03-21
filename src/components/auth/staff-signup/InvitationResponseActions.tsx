
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface InvitationResponseActionsProps {
  onAccept: () => void;
  onDecline: () => void;
  isResponding: boolean;
}

const InvitationResponseActions: React.FC<InvitationResponseActionsProps> = ({
  onAccept,
  onDecline,
  isResponding
}) => {
  return (
    <div className="flex gap-3 flex-col sm:flex-row w-full">
      <Button 
        variant="default" 
        className="w-full sm:w-1/2 gap-2" 
        onClick={onAccept}
        disabled={isResponding}
      >
        <Check className="h-4 w-4" />
        Accept & Continue
      </Button>
      <Button 
        variant="outline" 
        className="w-full sm:w-1/2 gap-2 text-destructive border-destructive hover:bg-destructive/10" 
        onClick={onDecline}
        disabled={isResponding}
      >
        <X className="h-4 w-4" />
        Decline
      </Button>
    </div>
  );
};

export default InvitationResponseActions;
