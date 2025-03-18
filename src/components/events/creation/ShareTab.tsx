
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";
import { InvitationRecipient } from "@/types/invitation.types";
import RecipientSelector from "@/components/invitations/RecipientSelector";
import ShareLinksTab from "../share/ShareLinksTab";

interface ShareTabProps {
  shareTab: 'recipients' | 'links';
  setShareTab: (tab: 'recipients' | 'links') => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  handleSendEmail: (email: string) => void;
  handlePrevTab: () => void;
  isSubmitting: boolean;
}

const ShareTab: React.FC<ShareTabProps> = ({
  shareTab,
  setShareTab,
  recipients,
  addRecipient,
  removeRecipient,
  handleSendEmail,
  handlePrevTab,
  isSubmitting
}) => {
  return (
    <>
      <CardContent className="space-y-6">
        <Tabs
          value={shareTab}
          onValueChange={(value) => setShareTab(value as 'recipients' | 'links')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="links">Share Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipients">
            <div className="py-4">
              <RecipientSelector
                selectedRecipients={recipients}
                onAddRecipient={addRecipient}
                onRemoveRecipient={removeRecipient}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="links">
            <ShareLinksTab
              eventId="temp-event-id" // This will be replaced with the actual ID after creation
              onSendEmail={handleSendEmail}
            />
          </TabsContent>
        </Tabs>
        
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center mb-2">
            <div className={cn(
              "h-2 w-2 rounded-full mr-2",
              recipients.length > 0 ? "bg-green-500" : "bg-amber-500"
            )}></div>
            <span className="text-sm font-medium">
              {recipients.length > 0 
                ? "Event will be sent to recipients" 
                : "Event will be saved as draft"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {recipients.length > 0 
              ? "Recipients will receive an invitation to view and respond to your event." 
              : "Your event will be saved as a draft. You can send it later."}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={handlePrevTab}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            variant="outline"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || recipients.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default ShareTab;
