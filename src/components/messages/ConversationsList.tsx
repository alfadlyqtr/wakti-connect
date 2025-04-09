
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useMessaging } from "@/hooks/useMessaging";
import { Conversation } from "@/types/message.types";

interface ConversationsListProps {
  staffOnly?: boolean;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ staffOnly = false }) => {
  const { conversations, isLoadingConversations } = useMessaging({ staffOnly });
  const navigate = useNavigate();
  
  if (isLoadingConversations) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }
  
  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
      </div>
    );
  }
  
  return (
    <div className="divide-y">
      {conversations.map((conversation: Conversation) => (
        <NavLink
          key={conversation.id}
          to={`/dashboard/messages/${conversation.userId}`}
          className={({ isActive }) => 
            `flex items-center gap-3 p-4 hover:bg-accent/20 transition-colors ${
              isActive ? 'bg-accent/10' : ''
            }`
          }
        >
          <Avatar>
            <AvatarImage src={conversation.avatar || ''} alt={conversation.displayName} />
            <AvatarFallback>{conversation.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{conversation.displayName}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage}
            </p>
          </div>
          
          {conversation.unread && (
            <Badge variant="default" className="ml-auto">New</Badge>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default ConversationsList;
