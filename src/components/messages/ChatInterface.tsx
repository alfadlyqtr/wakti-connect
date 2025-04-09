
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateGoogleMapsUrl } from "@/config/maps";
import { generateLocationMessage } from "./chat/LocationUtils";
import { toast } from "@/components/ui/use-toast";

// Import refactored components
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import NoPermissionMessage from "./chat/NoPermissionMessage";

interface UserProfile {
  display_name?: string;
  full_name?: string;
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
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  
  // Validate we have a userId
  useEffect(() => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user ID provided for chat",
        variant: "destructive"
      });
      navigate('/dashboard/messages');
    }
  }, [userId, navigate]);
  
  const { 
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    canMessage,
    isCheckingPermission,
    markConversationAsRead,
    refetchMessages
  } = useMessaging({
    otherUserId: userId
  });
  
  // Get current user ID
  const { data: currentUserId } = useQuery({
    queryKey: ['currentUserId'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.user?.id;
    }
  });
  
  // Get profile of the user we're chatting with
  const { data: otherUserProfile, isLoading: isLoadingProfile } = useQuery<UserProfile | StaffProfile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        // First try to get from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, full_name, avatar_url, account_type, business_name')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileData) {
          console.log("Profile found:", profileData);
          return profileData as UserProfile;
        }
        
        // If not found in profiles, try business_staff table
        if (!profileData) {
          console.log("Profile not found, checking business_staff");
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('name, email, profile_image_url')
            .eq('staff_id', userId)
            .maybeSingle();
            
          if (staffData) {
            console.log("Staff profile found:", staffData);
            return {
              name: staffData.name,
              email: staffData.email,
              profile_image_url: staffData.profile_image_url
            } as StaffProfile;
          }
        }
        
        console.log("No profile found for user:", userId);
        setIsError(true);
        return null;
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsError(true);
        return null;
      }
    },
    enabled: !!userId,
    retry: 3
  });
  
  // Get current user profile for message permissions
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
  
  // Mark messages as read when the conversation opens
  useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
      
      // Set up an interval to refetch messages every 10 seconds
      const intervalId = setInterval(() => {
        refetchMessages();
      }, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [userId, markConversationAsRead, refetchMessages]);
  
  // Check if this is a business-staff or staff-business conversation
  const { data: isBusinessStaffConversation } = useQuery({
    queryKey: ['isBusinessStaffConversation', userId, currentUserId],
    queryFn: async () => {
      if (!userId || !currentUserId) return false;
      
      try {
        // Check if current user is a business owner and other user is their staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('business_id', currentUserId)
          .eq('staff_id', userId)
          .maybeSingle();
          
        if (staffData) return true;
        
        // Check if current user is staff and other user is their business owner
        const { data: currentUserStaffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', currentUserId)
          .eq('business_id', userId)
          .maybeSingle();
          
        return !!currentUserStaffData;
      } catch (error) {
        console.error("Error checking business-staff relationship:", error);
        return false;
      }
    },
    enabled: !!userId && !!currentUserId
  });
  
  const canShareLocation = userProfile?.account_type !== 'free';
  
  // Handle different profile types safely
  const getDisplayName = (): string => {
    if (!otherUserProfile) return 'User';
    
    if ('name' in otherUserProfile) {
      // This is a StaffProfile
      return otherUserProfile.name || 'Staff Member';
    } else {
      // This is a UserProfile
      return otherUserProfile.business_name || 
             otherUserProfile.display_name || 
             otherUserProfile.full_name || 
             'User';
    }
  };
  
  const getAvatarUrl = (): string | undefined => {
    if (!otherUserProfile) return undefined;
    
    // Handle both UserProfile (avatar_url) and StaffProfile (profile_image_url)
    if ('profile_image_url' in otherUserProfile) {
      // This is a StaffProfile
      return otherUserProfile.profile_image_url;
    } else if ('avatar_url' in otherUserProfile) {
      // This is a UserProfile
      return otherUserProfile.avatar_url;
    }
    
    return undefined;
  };
  
  const handleSendMessage = async (content: string) => {
    if (!userId) return;
    
    try {
      console.log("Sending message:", content);
      await sendMessage({ 
        recipientId: userId, 
        content
      });
      
      // Force refetch messages after sending
      setTimeout(() => {
        refetchMessages();
      }, 500);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error sending message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendLocation = async (location: string) => {
    if (!userId || !canShareLocation) return;
    
    const mapsUrl = generateGoogleMapsUrl(location);
    const locationMessage = generateLocationMessage(location, mapsUrl);
    
    try {
      await sendMessage({
        recipientId: userId,
        content: locationMessage
      });
      
      // Force refetch messages after sending
      setTimeout(() => {
        refetchMessages();
      }, 500);
    } catch (error) {
      console.error("Failed to send location:", error);
      toast({
        title: "Error sharing location",
        description: "Your location could not be shared. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoadingMessages || isCheckingPermission || isLoadingProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Could not load conversation</p>
          <p className="text-muted-foreground mb-4">This user may not exist or you don't have permission to message them.</p>
          <button 
            onClick={() => navigate('/dashboard/messages')}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }
  
  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  
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
      
      {canMessage || isBusinessStaffConversation ? (
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
