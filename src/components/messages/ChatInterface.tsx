
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

// Define the profile type to match what comes from the database
interface UserProfile {
  display_name: string;
  full_name: string;
  avatar_url?: string;
  account_type?: 'free' | 'individual' | 'business' | 'staff';
  business_name?: string;
}

interface StaffProfile {
  name: string;
  email: string;
  profile_image_url?: string;
}

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
  
  const { data: otherUserProfile } = useQuery<UserProfile | StaffProfile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url, account_type, business_name')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      // If this is a business staff member, get their information
      if (!data) {
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('name, email, profile_image_url')
          .eq('staff_id', userId)
          .maybeSingle();
          
        if (staffError) throw staffError;
        
        if (staffData) {
          return {
            name: staffData.name,
            email: staffData.email,
            profile_image_url: staffData.profile_image_url
          } as StaffProfile;
        }
      }
      
      return data as UserProfile;
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
  
  // Handle different profile types safely
  const displayName = 
    'name' in (otherUserProfile || {}) ? (otherUserProfile as StaffProfile).name :
    (otherUserProfile as UserProfile)?.business_name || 
    (otherUserProfile as UserProfile)?.display_name || 
    (otherUserProfile as UserProfile)?.full_name || 
    'User';
  
  const avatarUrl = 
    'profile_image_url' in (otherUserProfile || {}) ? (otherUserProfile as StaffProfile).profile_image_url :
    (otherUserProfile as UserProfile)?.avatar_url;
  
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
        avatarUrl={avatarUrl}
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
