
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Message } from "@/types/message.types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ChatInterface = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoadingMessages, sendMessage, isSending, canMessage } = useMessaging(userId);

  // Get profile data of the other user
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url, account_type, business_name')
        .eq('id', userId)
        .single();
        
      return data;
    },
    enabled: !!userId,
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !messageText.trim() || !canMessage) return;
    
    if (messageText.length > 20) {
      toast({
        title: "Message too long",
        description: "Messages are limited to 20 characters",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage({ recipientId: userId, content: messageText.trim() });
    setMessageText("");
  };

  const getDisplayName = () => {
    if (!userProfile) return "User";
    
    if (userProfile.account_type === 'business' && userProfile.business_name) {
      return userProfile.business_name;
    }
    
    return userProfile.display_name || userProfile.full_name || "User";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderMessageContent = (message: Message) => {
    // Message content is a simple string (limited to 20 chars)
    return <p className="p-3 rounded-lg">{message.content}</p>;
  };

  if (!userId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userProfile?.avatar_url || ''} />
          <AvatarFallback>{getInitials(getDisplayName())}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{getDisplayName()}</h3>
          <p className="text-xs text-muted-foreground">
            {userProfile?.account_type === 'business' ? 'Business' : 'Individual'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground pt-10">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId !== userId;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[70%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials(getDisplayName())}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {renderMessageContent(message)}
                    <div className={`text-xs px-3 pb-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {format(new Date(message.createdAt), "h:mm a")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={canMessage ? "Type a message (max 20 chars)" : "You cannot message this user"}
          className="flex-1"
          maxLength={20}
          disabled={!canMessage || isSending}
        />
        <Button type="submit" size="icon" disabled={!canMessage || !messageText.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
