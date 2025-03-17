import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RecipientSelector } from "./RecipientSelector";
import { Loader2 } from "lucide-react";
import { sendInvitation } from "@/services/invitation/invitations";
import { toast } from "@/components/ui/use-toast";

// Using sendInvitation instead of createInvitation which doesn't exist
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
  const [recipient, setRecipient] = useState<{ type: 'user' | 'email'; id: string } | null>(null);

  const handleSendInvitation = async () => {
    if (!recipient) {
      toast({
        title: "Missing Recipient",
        description: "Please select a recipient to send the invitation to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendInvitation(appointmentId, {
        target: recipient,
        shared_as_link: false,
        customization: null
      });

      toast({
        title: "Invitation Sent",
        description: `Invitation sent successfully to ${recipient.id}`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RecipientSelector onRecipientSelect={setRecipient} />
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSendInvitation} disabled={isLoading || !recipient}>
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
