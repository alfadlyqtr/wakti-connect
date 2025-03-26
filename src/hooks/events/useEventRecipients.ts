
import { useState, useCallback } from "react";
import { InvitationRecipient } from "@/types/invitation.types";
import { ShareTab } from "@/types/form.types";

export const useEventRecipients = () => {
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [shareTab, setShareTab] = useState<ShareTab>('recipients');
  
  const addRecipient = useCallback((recipient: InvitationRecipient) => {
    setRecipients(prev => [...prev, recipient]);
  }, []);

  const removeRecipient = useCallback((index: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle email sharing from the ShareLinksTab
  const handleSendEmail = useCallback((email: string) => {
    const newRecipient: InvitationRecipient = {
      id: Date.now().toString(), // temporary ID
      name: email,
      email: email,
      type: 'email'
    };
    
    addRecipient(newRecipient);
    
    // Switch to the recipients tab to show the new recipient
    setShareTab('recipients');
  }, [addRecipient]);

  return {
    recipients,
    shareTab,
    setShareTab,
    addRecipient,
    removeRecipient,
    handleSendEmail
  };
};
