
import React from "react";
import { useParams } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateGoogleMapsUrl } from "@/config/maps";
import { generateLocationMessage } from "./chat/LocationUtils";

// Import refactored components
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import NoPermissionMessage from "./chat/NoPermissionMessage";

const ChatInterface = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { 
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    canMessage,
    isCheckingPermission,
    markConversationAsRead
  } = useMessaging({
    otherUserId: userId
  });
  
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
        .select('display_name, full_name, avatar_url, account_type, business_name')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
  
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
  
  // Mark messages as read when component mounts
  React.useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
    }
  }, [userId, markConversationAsRead]);
  
  const canShareLocation = userProfile?.account_type !== 'free';
  const displayName = 
    otherUserProfile?.business_name || 
    otherUserProfile?.display_name || 
    otherUserProfile?.full_name || 
    'User';
  
  const handleSendMessage = async (content: string) => {
    if (!userId) return;
    
    await sendMessage({ 
      recipientId: userId, 
      content
    });
  };

  const handleSendLocation = async (location: string) => {
    if (!userId || !canShareLocation) return;
    
    const mapsUrl = generateGoogleMapsUrl(location);
    const locationMessage = generateLocationMessage(location, mapsUrl);
    
    await sendMessage({
      recipientId: userId,
      content: locationMessage
    });
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
      <ChatHeader 
        displayName={displayName} 
        avatarUrl={otherUserProfile?.avatar_url} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages} 
          currentUserId={currentUserId} 
        />
      </div>
      
      {canMessage ? (
        <MessageInput 
          onSendMessage={handleSendMessage}
          onSendLocation={handleSendLocation}
          canShareLocation={canShareLocation}
          isSending={isSending}
        />
      ) : (
        <NoPermissionMessage />
      )}
    </div>
  );
};

export default ChatInterface;
