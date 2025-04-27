
import React from "react";
import { Message } from "@/types/message.types";
import { Button } from "@/components/ui/button";
import { Reply, Check, CheckCheck } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onReplyClick?: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, onReplyClick }) => {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const isCurrentUser = msg.senderId === currentUserId;
        
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] group ${isCurrentUser ? 'order-last' : 'order-first'}`}>
              <MessageBubble 
                content={msg.content || ''} 
                type={msg.type || 'text'} 
                isCurrentUser={isCurrentUser}
                senderName={!isCurrentUser ? msg.senderName : undefined}
                timestamp={msg.createdAt}
                audioUrl={msg.audioUrl}
                imageUrl={msg.imageUrl}
              />
            </div>

            {onReplyClick && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 self-end mb-6" 
                onClick={() => onReplyClick(msg)}
                title="Reply"
              >
                <Reply className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {isCurrentUser && (
              <div className="text-xs text-muted-foreground self-end mb-1">
                {msg.isRead ? (
                  <CheckCheck className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
