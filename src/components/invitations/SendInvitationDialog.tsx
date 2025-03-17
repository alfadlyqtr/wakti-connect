
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import RecipientSelector from "./RecipientSelector";
import { Loader2 } from "lucide-react";
import { sendInvitation } from "@/services/invitation/invitations";
import { toast } from "@/components/ui/use-toast";
import { InvitationRecipient } from "@/types/invitation.types";

interface SendInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  onInvitationSent?: () => void;
}

export const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({
  open,
  onOpenChange,
  appointmentId,
  onInvitationSent
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<InvitationRecipient[]>([]);

  const handleSendInvitation = async () => {
    if (selectedRecipients.length === 0) {
      toast({
        title: "Missing Recipient",
        description: "Please select at least one recipient to send the invitation to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now we'll just send to the first recipient, but in future we could send to multiple
      const firstRecipient = selectedRecipients[0];
      
      await sendInvitation(appointmentId, {
        target: {
          type: firstRecipient.type === 'contact' ? 'user' : 'email',
          id: firstRecipient.id || firstRecipient.email || ''
        },
        shared_as_link: false,
        customization: null
      });

      toast({
        title: "Invitation Sent",
        description: `Invitation sent successfully to ${firstRecipient.name}`,
      });

      onInvitationSent?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error Sending Invitation",
        description: error.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecipient = (recipient: InvitationRecipient) => {
    setSelectedRecipients(prev => [...prev, recipient]);
  };

  const handleRemoveRecipient = (index: number) => {
    setSelectedRecipients(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RecipientSelector 
            selectedRecipients={selectedRecipients}
            onAddRecipient={handleAddRecipient}
            onRemoveRecipient={handleRemoveRecipient}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSendInvitation} disabled={isLoading || selectedRecipients.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
