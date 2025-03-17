
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyMessagesStateProps {
  canSendMessages: boolean;
  userType: string;
}

const EmptyMessagesState = ({ canSendMessages, userType }: EmptyMessagesStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-12">
      <MessageSquare className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No messages yet</h3>
      
      {userType === 'free' ? (
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          Free accounts cannot send messages. Upgrade to an Individual or Business account to start messaging.
        </p>
      ) : !canSendMessages ? (
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          {userType === 'individual' 
            ? "You can message business accounts you're subscribed to or individuals in your contacts."
            : "You can message all users as a business account."}
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          Start connecting with others through messaging. Messages expire after 24 hours.
        </p>
      )}
      
      {userType === 'free' ? (
        <Button onClick={() => navigate('/dashboard/upgrade')}>
          Upgrade Now
        </Button>
      ) : !canSendMessages && userType === 'individual' ? (
        <Button onClick={() => navigate('/dashboard/contacts')}>
          Manage Contacts
        </Button>
      ) : canSendMessages && (
        <Button onClick={() => navigate('/dashboard/contacts')}>
          Find People to Message
        </Button>
      )}
    </div>
  );
};

export default EmptyMessagesState;
