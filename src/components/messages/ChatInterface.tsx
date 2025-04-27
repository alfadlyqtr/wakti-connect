import React, { useEffect, useRef, useState } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import MessageList from "./chat/MessageList";
import MessageComposer from "./chat/MessageComposer";
import { Message } from "@/types/message.types";
import { Loader2 } from "lucide-react";
import { safeFormatDistanceToNow } from "@/utils/safeFormatters";

interface ChatInterfaceProps {
  userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const { 
    messages, 
    isLoadingMessages, 
    sendMessage, 
    isSending,
    markConversationAsRead
  } = useMessaging(userId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
    }
  }, [userId, markConversationAsRead]);
  
  const handleSendMessage = (
    content: string | null, 
    type: 'text' | 'voice' | 'image' = 'text',
    audioUrl?: string,
    imageUrl?: string
  ) => {
    if (!userId) return;
    
    sendMessage({
      recipientId: userId,
      content,
      type,
      audioUrl,
      imageUrl
    });
    
    if (replyToMessage) {
      setReplyToMessage(null);
    }
  };
  
  const handleReplyClick = (message: Message) => {
    setReplyToMessage(message);
  };
  
  const organizeMessagesByDate = () => {
    const messagesByDate: Record<string, Message[]> = {};
    
    messages.forEach(msg => {
      try {
        const date = new Date(msg.createdAt);
        const dateKey = isNaN(date.getTime()) 
          ? "Invalid Date" 
          : date.toLocaleDateString();
        
        if (!messagesByDate[dateKey]) {
          messagesByDate[dateKey] = [];
        }
        messagesByDate[dateKey].push(msg);
      } catch (error) {
        if (!messagesByDate["Unknown Date"]) {
          messagesByDate["Unknown Date"] = [];
        }
        messagesByDate["Unknown Date"].push(msg);
        console.error("Error processing message date:", error, "Message:", msg);
      }
    });
    
    return messagesByDate;
  };
  
  const messagesByDate = organizeMessagesByDate();
  const dateSections = Object.keys(messagesByDate).sort((a, b) => {
    if (a === "Invalid Date" || a === "Unknown Date") return -1;
    if (b === "Invalid Date" || b === "Unknown Date") return 1;
    
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 pr-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {dateSections.map(date => (
              <div key={date} className="mb-6">
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">
                    {date === new Date().toLocaleDateString()
                      ? "Today"
                      : date === "Invalid Date" || date === "Unknown Date" 
                        ? "Previous Messages" 
                        : safeFormatDistanceToNow(date, "Previous")}
                  </span>
                </div>
                <MessageList 
                  messages={messagesByDate[date]} 
                  onReplyClick={handleReplyClick}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="mt-auto">
        <MessageComposer 
          onSendMessage={handleSendMessage}
          isDisabled={isSending}
          replyToMessage={replyToMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
