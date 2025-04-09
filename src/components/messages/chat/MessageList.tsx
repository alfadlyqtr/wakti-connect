
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/message.types";
import MessageBubble from "./MessageBubble";

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
          <p>No messages yet. Start a conversation!</p>
          <p className="text-sm mt-2">Messages will appear here as you chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        
        return (
          <div 
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <MessageBubble 
              content={message.content} 
              isCurrentUser={isCurrentUser} 
              senderName={message.senderName}
              timestamp={message.createdAt}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
