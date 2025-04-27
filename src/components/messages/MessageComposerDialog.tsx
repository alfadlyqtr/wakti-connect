
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserContact } from "@/types/invitation.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageComposer from "./chat/MessageComposer";
import { useMessaging } from "@/hooks/useMessaging";
import MessageList from "./chat/MessageList";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MessageComposerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: UserContact | null;
}

const MessageComposerDialog: React.FC<MessageComposerDialogProps> = ({
  isOpen,
  onOpenChange,
  contact
}) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
      }
    };
    getUser();
  }, []);

  const { 
    messages, 
    sendMessage, 
    isLoadingMessages,
    markConversationAsRead
  } = useMessaging(contact?.contact_id || "");

  // Mark conversation as read when dialog opens
  useEffect(() => {
    if (isOpen && contact?.contact_id) {
      markConversationAsRead(contact.contact_id);
    }
  }, [isOpen, contact, markConversationAsRead]);

  const handleSendMessage = (
    content: string | null, 
    type: 'text' | 'voice' | 'image' = 'text', 
    audioUrl?: string, 
    imageUrl?: string
  ) => {
    if (!contact?.contact_id) return;
    
    sendMessage({
      recipientId: contact.contact_id,
      content,
      type,
      audioUrl,
      imageUrl
    });
  };

  if (!contact) {
    return null;
  }

  const contactName = contact.contactProfile?.displayName || 
                     contact.contactProfile?.fullName || 
                     'Contact';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
              <AvatarFallback>
                {contactName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{contactName}</DialogTitle>
              <div className="flex gap-2 mt-1">
                {contact.contactProfile?.accountType === 'business' ? (
                  <Badge variant="outline" className="bg-blue-50 text-xs">Business</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-xs">Individual</Badge>
                )}
                {contact.staff_relation_id && (
                  <Badge variant="outline" className="bg-purple-50 text-xs">Staff</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto my-4 p-2 max-h-[60vh]">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading messages...</p>
            </div>
          ) : messages && messages.length > 0 ? (
            <MessageList 
              messages={messages} 
              currentUserId={currentUserId || undefined}
            />
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>No messages yet. Send a message to start the conversation.</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <MessageComposer 
            onSendMessage={handleSendMessage}
            isDisabled={!contact.contact_id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposerDialog;
