
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatInterface from "@/components/messages/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

const MessagesConversation: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
        <p className="text-muted-foreground mb-4">Please select a conversation to view messages</p>
        <Button onClick={() => navigate("/dashboard/messages")}>
          Back to Messages
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {isMobile && (
        <div className="p-2 border-b">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/messages')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Messages
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <ChatInterface userId={userId} />
      </div>
    </div>
  );
};

export default MessagesConversation;
