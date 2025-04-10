
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MessageList from "./chat/MessageList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, Briefcase, Send } from "lucide-react";
import MessageComposer from "./chat/MessageComposer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar } from "@/components/ui/avatar"; 
import { isUserProfile, type UserProfile, type StaffProfile, Message } from "@/types/message.types";
import { toast } from "@/components/ui/use-toast";

const ChatInterface: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedUserData, setSelectedUserData] = useState<UserProfile | StaffProfile | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
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
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    getCurrentUser();
  }, []);
  
  useEffect(() => {
    const staffRole = localStorage.getItem('userRole') === 'staff';
    setIsStaff(staffRole);
  }, []);
  
  const { isLoading: isLoadingUserData } = useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, business_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileData) {
        setSelectedUserData(profileData as UserProfile);
        return profileData;
      }
      
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
  
  useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
    }
  }, [userId, messages, markConversationAsRead]);
  
  const handleSendMessage = async (content: string | null, type: 'text' | 'voice' | 'image' = 'text', audioUrl?: string, imageUrl?: string) => {
    if (!userId || isSending) return;
    
    try {
      await sendMessage({
        recipientId: userId,
        content,
        type,
        audioUrl,
        imageUrl
      });
      
      // Clear the reply state after sending
      setReplyToMessage(null);
      setReplyContent("");
      
      setTimeout(() => {
        refetchMessages();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleReplyClick = (message: Message) => {
    setReplyToMessage(message);
    // Focus the message composer
    const composerInput = document.querySelector('input[type="text"]');
    if (composerInput) {
      (composerInput as HTMLInputElement).focus();
    }
  };
  
  const handleCancelReply = () => {
    setReplyToMessage(null);
    setReplyContent("");
  };
  
  const handleGoBack = () => {
    navigate('/dashboard/messages');
  };
  
  const handleRefetch = () => {
    refetchMessages();
  };
  
  const getDisplayName = (): string => {
    if (!selectedUserData) return 'User';
    
    if (isUserProfile(selectedUserData)) {
      return selectedUserData.business_name || selectedUserData.display_name || selectedUserData.full_name;
    }
    
    return selectedUserData.name;
  };
  
  const getAvatar = (): string | undefined => {
    if (!selectedUserData) return undefined;
    
    if (isUserProfile(selectedUserData)) {
      return selectedUserData.avatar_url;
    }
    
    return selectedUserData.profile_image_url;
  };
  
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
  
  if (messagesError) {
    return (
      <div className="flex flex-col h-full border-l p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>An error occurred loading the conversation.</p>
            <Button variant="outline" onClick={handleRefetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full border-l">
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
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages} 
          currentUserId={currentUserId || undefined} 
          onReplyClick={handleReplyClick}
        />
      </div>
      
      {replyToMessage && (
        <div className="p-2 bg-muted border-t flex items-start gap-2">
          <div className="flex-1 text-sm">
            <span className="text-xs font-medium">Replying to:</span>
            <div className="truncate">{replyToMessage.content}</div>
          </div>
          <Button size="sm" variant="ghost" onClick={handleCancelReply}>
            Cancel
          </Button>
        </div>
      )}
      
      <div className="border-t p-3">
        <MessageComposer onSendMessage={handleSendMessage} isDisabled={!canMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
