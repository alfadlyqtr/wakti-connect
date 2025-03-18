
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types/message.types";
import { useMessaging } from "@/hooks/useMessaging";

const ConversationsList = () => {
  const navigate = useNavigate();
  const { userId: currentChatUserId } = useParams<{ userId: string }>();
  const { conversations, isLoadingConversations } = useMessaging();

  const handleSelectConversation = (userId: string) => {
    // Use a full path to ensure proper navigation
    navigate(`/dashboard/messages/${userId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoadingConversations) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="rounded-full bg-muted h-12 w-12"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation: Conversation) => (
        <div
          key={conversation.userId}
          className={`p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-3 ${
            conversation.userId === currentChatUserId ? 'bg-muted' : ''
          }`}
          onClick={() => handleSelectConversation(conversation.userId)}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.avatar || ''} />
            <AvatarFallback>{getInitials(conversation.displayName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{conversation.displayName}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {format(new Date(conversation.lastMessageTime), 'h:mm a')}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                {conversation.lastMessage}
              </p>
              {conversation.unread && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  •
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
