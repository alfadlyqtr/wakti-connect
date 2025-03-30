
import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ConversationsList from "@/components/messages/ConversationsList";
import ChatInterface from "@/components/messages/ChatInterface";
import EmptyMessagesState from "@/components/messages/EmptyMessagesState";
import { useMessaging } from "@/hooks/useMessaging";

const DashboardMessagesHome = () => {
  const navigate = useNavigate();
  const { conversations } = useMessaging();
  const [inputValue, setInputValue] = useState("");
  
  const { data: userProfile } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      return data;
    },
  });
  
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // Implementation will go here
  };
  
  const canSendMessages = userProfile?.account_type !== 'free';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            {canSendMessages 
              ? "Connect with others through messaging. Messages expire after 24 hours."
              : "Free accounts cannot send messages. Upgrade to start messaging."}
          </p>
        </div>
        
        {canSendMessages && (
          <Button 
            onClick={() => navigate('/dashboard/contacts')}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Message</span>
          </Button>
        )}
      </div>
      
      <div className="grid h-[calc(100vh-220px)] grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="border-r md:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations?.length > 0 ? (
              <ConversationsList />
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 overflow-hidden flex flex-col">
          {conversations?.length > 0 ? (
            <ChatInterface 
              onSendMessage={handleSendMessage}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          ) : (
            <EmptyMessagesState />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMessagesHome;
