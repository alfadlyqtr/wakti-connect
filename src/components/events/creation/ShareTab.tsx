
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RecipientSelector from "@/components/invitations/RecipientSelector";
import ShareLinksTab from "@/components/events/creation/ShareLinksTab";
import { InvitationRecipient } from "@/types/invitation.types";

interface ShareTabProps {
  shareTab: 'recipients' | 'links';
  setShareTab: (tab: 'recipients' | 'links') => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  handleSendEmail: (email: string) => void;
  handlePrevTab: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const ShareTab: React.FC<ShareTabProps> = ({
  shareTab,
  setShareTab,
  recipients,
  addRecipient,
  removeRecipient,
  handleSendEmail,
  handlePrevTab,
  isSubmitting,
  isEdit = false
}) => {
  return (
    <div className="px-6 py-4 space-y-6">
      <Tabs value={shareTab} onValueChange={(value) => setShareTab(value as 'recipients' | 'links')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="links">Share Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipients">
          <RecipientSelector
            selectedRecipients={recipients}
            onAddRecipient={addRecipient}
            onRemoveRecipient={removeRecipient}
          />
        </TabsContent>
        
        <TabsContent value="links">
          <ShareLinksTab 
            onSendEmail={handleSendEmail} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevTab}
          type="button"
        >
          Previous
        </Button>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isEdit 
            ? recipients.length > 0 
              ? "Update & Send Invitations" 
              : "Update Event"
            : recipients.length > 0 
              ? "Create & Send Invitations" 
              : "Save as Draft"}
        </Button>
      </div>
    </div>
  );
};

export default ShareTab;
