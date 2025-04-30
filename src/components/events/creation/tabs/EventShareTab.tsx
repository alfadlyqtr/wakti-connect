
import React from "react";
import { ShareTab } from "@/types/form.types";
import { InvitationRecipient } from "@/types/invitation.types";
import ShareTabContent from "../../sharing/ShareTabContent";

interface EventShareTabProps {
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
  onSendEmail: (email: string) => void;
  eventTitle?: string;
  handlePreviousTab?: () => void;
}

const EventShareTab: React.FC<EventShareTabProps> = ({
  recipients,
  addRecipient,
  removeRecipient,
  shareTab,
  setShareTab,
  onSendEmail,
  eventTitle,
  handlePreviousTab,
}) => {
  return (
    <div className="space-y-6">
      <ShareTabContent
        recipients={recipients}
        addRecipient={addRecipient}
        removeRecipient={removeRecipient}
        activeTab={shareTab}
        setActiveTab={setShareTab}
        eventTitle={eventTitle}
        onSendEmail={onSendEmail}
      />
      
      {handlePreviousTab && (
        <div className="flex justify-end mt-6">
          <div className="text-sm text-muted-foreground mt-2">
            Review your event details before submitting
          </div>
        </div>
      )}
    </div>
  );
};

export default EventShareTab;
