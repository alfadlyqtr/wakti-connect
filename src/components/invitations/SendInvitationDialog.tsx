import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Palette, Mail, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { InvitationRecipient } from "@/types/invitation.types";
import InvitationBuilderDialog from "./InvitationBuilderDialog";
import RecipientSelector from "./RecipientSelector";
import { createInvitation } from "@/services/invitation";

interface SendInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
  onInvitationsSent: () => void;
}

const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  onInvitationsSent
}) => {
  const [activeTab, setActiveTab] = useState<string>("style");
  const [customizationId, setCustomizationId] = useState<string | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<InvitationRecipient[]>([]);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleAddRecipient = (recipient: InvitationRecipient) => {
    const exists = selectedRecipients.some(r => {
      if (r.type === 'contact' && recipient.type === 'contact') {
        return r.id === recipient.id;
      }
      if (r.type === 'email' && recipient.type === 'email') {
        return r.email === recipient.email;
      }
      return false;
    });
    
    if (!exists) {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
  };
  
  const handleRemoveRecipient = (index: number) => {
    setSelectedRecipients(selectedRecipients.filter((_, i) => i !== index));
  };
  
  const handleNext = () => {
    if (activeTab === "style" && customizationId) {
      setActiveTab("recipients");
    } else if (activeTab === "recipients" && selectedRecipients.length > 0) {
      handleSendInvitations();
    }
  };
  
  const handleBack = () => {
    if (activeTab === "recipients") {
      setActiveTab("style");
    }
  };
  
  const handleCustomizationCreated = (id: string) => {
    setCustomizationId(id);
  };
  
  const handleSendInvitations = async () => {
    if (!appointment?.id || selectedRecipients.length === 0) {
      toast({
        title: "Cannot Send Invitations",
        description: "Please select at least one recipient.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await createInvitation(
        appointment.id,
        selectedRecipients,
        customizationId || undefined
      );
      
      setIsSent(true);
      setActiveTab("sent");
      onInvitationsSent();
      
      toast({
        title: "Invitations Sent",
        description: `Sent to ${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''}.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send Invitations",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleClose = () => {
    if (isSent) {
      setCustomizationId(null);
      setSelectedRecipients([]);
      setActiveTab("style");
      setIsSent(false);
    }
    onOpenChange(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
            <DialogDescription>
              Customize and send invitations for "{appointment?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="style" disabled={isSent}>
                <Palette className="h-4 w-4 mr-2" />
                Style
              </TabsTrigger>
              <TabsTrigger value="recipients" disabled={!customizationId || isSent}>
                <Mail className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
              <TabsTrigger value="sent" disabled={!isSent}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="style">
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Design your invitation before sending it to recipients.
                </p>
                
                {customizationId ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="bg-muted/40 rounded-md px-4 py-6 text-center w-full">
                      <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <h3 className="text-lg font-medium">Invitation Designed</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your customized invitation is ready to send
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setIsCustomizerOpen(true)}
                    >
                      Edit Design
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center py-4">
                    <Button onClick={() => setIsCustomizerOpen(true)}>
                      Design Invitation
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recipients">
              <RecipientSelector
                selectedRecipients={selectedRecipients}
                onAddRecipient={handleAddRecipient}
                onRemoveRecipient={handleRemoveRecipient}
              />
            </TabsContent>
            
            <TabsContent value="sent">
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mt-2">Invitations Sent!</h3>
                <p className="text-muted-foreground max-w-md">
                  Your invitations have been sent to {selectedRecipients.length} recipient
                  {selectedRecipients.length > 1 ? 's' : ''}.
                </p>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setCustomizationId(null);
                    setSelectedRecipients([]);
                    setActiveTab("style");
                    setIsSent(false);
                  }}>
                    Send More Invitations
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {!isSent && (
            <DialogFooter className="flex items-center justify-between pt-4 flex-row">
              <div>
                {activeTab === "recipients" && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                
                {activeTab !== "sent" && (
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    disabled={
                      (activeTab === "style" && !customizationId) ||
                      (activeTab === "recipients" && selectedRecipients.length === 0) ||
                      isSending
                    }
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      activeTab === "recipients" ? "Send Invitations" : "Next"
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <InvitationBuilderDialog
        open={isCustomizerOpen}
        onOpenChange={setIsCustomizerOpen}
        appointment={appointment}
        onCustomizationCreated={handleCustomizationCreated}
      />
    </>
  );
};

export default SendInvitationDialog;
