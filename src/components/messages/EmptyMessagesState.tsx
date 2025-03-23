
import React from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyMessagesStateProps {
  canSendMessages: boolean;
  userType: string;
}

const EmptyMessagesState: React.FC<EmptyMessagesStateProps> = ({ 
  canSendMessages,
  userType
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
      <MessageSquare className="h-16 w-16 text-muted-foreground mb-6" />
      
      <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
      
      {canSendMessages ? (
        <>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your inbox is empty. Start a conversation by adding contacts and sending messages.
          </p>
          
          <Button onClick={() => navigate('/dashboard/contacts')}>
            Go to Contacts
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center text-amber-500 mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">Free Account Limitation</p>
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            Free accounts cannot send messages. Upgrade to an Individual or Business plan to use the messaging feature.
          </p>
          
          <Button onClick={() => navigate('/dashboard/billing')}>
            Upgrade Account
          </Button>
        </>
      )}
    </div>
  );
};

export default EmptyMessagesState;
