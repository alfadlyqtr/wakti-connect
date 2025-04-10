
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MessageList from "./chat/MessageList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, Briefcase } from "lucide-react";
import MessageComposer from "./chat/MessageComposer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar } from "@/components/ui/avatar"; 
import { isUserProfile, type UserProfile, type StaffProfile } from "@/types/message.types";

const ChatInterface: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedUserData, setSelectedUserData] = useState<UserProfile | StaffProfile | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const { 
    messages, 
    isLoadingMessages, 
    messagesError, 
    refetchMessages,
    sendMessage,
    isSending,
    canMessage,
    markConversationAsRead
  } = useMessaging(userId);
  
  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    getCurrentUser();
  }, []);
  
  // Check if current user is staff
  useEffect(() => {
    const staffRole = localStorage.getItem('userRole') === 'staff';
    setIsStaff(staffRole);
  }, []);
  
  // Fetch user/staff data
  const { isLoading: isLoadingUserData } = useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // Try to fetch user profile first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, business_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileData) {
        setSelectedUserData(profileData as UserProfile);
        return profileData;
      }
      
      // If no profile found, try to find staff data
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id, staff_id, name, profile_image_url')
        .eq('staff_id', userId)
        .eq('status', 'active')
        .maybeSingle();
        
      if (staffData) {
        setSelectedUserData({
          id: staffData.staff_id,
          name: staffData.name,
          profile_image_url: staffData.profile_image_url
        } as StaffProfile);
        return staffData;
      }
      
      return null;
    },
    enabled: !!userId
  });
  
  // Mark messages as read when viewing the conversation
  useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
    }
  }, [userId, messages, markConversationAsRead]);
  
  const handleSendMessage = async (content: string, type: 'text' | 'voice' | 'image' = 'text', audioUrl?: string, imageUrl?: string) => {
    if (!userId || isSending) return;
    
    try {
      await sendMessage({
        recipientId: userId,
        content,
        type,
        audioUrl,
        imageUrl
      });
      
      // Refetch messages after sending
      setTimeout(() => {
        refetchMessages();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleGoBack = () => {
    navigate('/dashboard/messages');
  };
  
  // Function to get the display name based on the loaded profile
  const getDisplayName = (): string => {
    if (!selectedUserData) return 'User';
    
    if (isUserProfile(selectedUserData)) {
      return selectedUserData.business_name || selectedUserData.display_name || selectedUserData.full_name;
    }
    
    return selectedUserData.name;
  };
  
  // Function to get avatar based on the loaded profile
  const getAvatar = (): string | undefined => {
    if (!selectedUserData) return undefined;
    
    if (isUserProfile(selectedUserData)) {
      return selectedUserData.avatar_url;
    }
    
    return selectedUserData.profile_image_url;
  };
  
  // Loading state
  if (isLoadingUserData) {
    return (
      <div className="flex flex-col h-full border-l p-4">
        <div className="animate-pulse flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-muted rounded-full"></div>
          <div className="h-6 bg-muted rounded w-32"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (messagesError) {
    return (
      <div className="flex flex-col h-full border-l p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>An error occurred loading the conversation.</p>
            <Button variant="outline" onClick={() => refetchMessages()} className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full border-l">
      {/* Header */}
      <div className="border-b p-3 flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Avatar className="h-9 w-9 border">
          {getAvatar() ? (
            <img src={getAvatar()} alt={getDisplayName()} className="object-cover" />
          ) : isStaff ? (
            <Briefcase className="h-4 w-4" />
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            {getDisplayName()}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {isStaff ? 'Staff Member' : 'User'}
          </p>
        </div>
      </div>
      
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} currentUserId={currentUserId || undefined} />
      </div>
      
      {/* Message composer */}
      <div className="border-t p-3">
        <MessageComposer onSendMessage={handleSendMessage} isDisabled={!canMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
