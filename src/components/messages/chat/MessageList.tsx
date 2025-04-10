
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/message.types";
import MessageBubble from "./MessageBubble";
import { AlertCircle } from "lucide-react";
import { isMessageExpired } from "@/utils/messageExpiration";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground bg-muted/20 p-6 rounded-lg max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
          <p className="font-medium mb-2">No messages yet</p>
          <p className="text-sm">Start a conversation by sending a message below.</p>
        </div>
      </div>
    );
  }

  // Filter out expired messages
  const activeMessages = messages.filter(msg => !isMessageExpired(msg.createdAt));

  if (activeMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground bg-muted/20 p-6 rounded-lg max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
          <p className="font-medium mb-2">No active messages</p>
          <p className="text-sm">Previous messages have expired after 24 hours. Start a new conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeMessages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        
        return (
          <div 
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <MessageBubble 
              content={message.content} 
              type={message.type || 'text'}
              isCurrentUser={isCurrentUser} 
              senderName={message.senderName}
              timestamp={message.createdAt}
              audioUrl={message.audioUrl}
              imageUrl={message.imageUrl}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
