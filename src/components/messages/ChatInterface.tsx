
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, AlertTriangle } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ChatInterface = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    canMessage,
    isCheckingPermission
  } = useMessaging(userId);
  
  const { data: currentUserId } = useQuery({
    queryKey: ['currentUserId'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.user?.id;
    }
  });
  
  const { data: otherUserProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
  
  const displayName = otherUserProfile?.display_name || otherUserProfile?.full_name || 'User';
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !messageContent.trim() || isSending) return;
    
    try {
      await sendMessage({ 
        recipientId: userId, 
        content: messageContent.trim()
      });
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  if (isLoadingMessages || isCheckingPermission) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center">
        <Avatar className="mr-2">
          <AvatarImage src={otherUserProfile?.avatar_url || ''} alt={displayName} />
          <AvatarFallback>{displayName[0]}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{displayName}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {canMessage ? (
        <form 
          onSubmit={handleSendMessage} 
          className="border-t p-4 flex gap-2"
        >
          <Input
            placeholder="Type a message (max 20 chars)"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            maxLength={20}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!messageContent.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="border-t p-4 bg-amber-50">
          <div className="flex items-center text-amber-600 mb-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <p className="font-medium">Can't send messages</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You don't have permission to message this user. This might be because:
          </p>
          <ul className="text-sm text-muted-foreground mt-1 list-disc pl-4">
            <li>You have a free account</li>
            <li>This user is not in your contacts</li>
            <li>You're not subscribed to this business</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
