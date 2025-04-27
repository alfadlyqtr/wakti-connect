
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MessageList from "./chat/MessageList";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  UserCircle, 
  Briefcase, 
  Send,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import MessageComposer from "./chat/MessageComposer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { isUserProfile, type UserProfile, type StaffProfile, Message } from "@/types/message.types";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  userId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId: propUserId }) => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId = propUserId || paramUserId;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedUserData, setSelectedUserData] = useState<UserProfile | StaffProfile | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
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
      
      setTimeout(() => {
        refetchMessages();
        // Scroll to bottom after sending
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
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
  };
  
  const handleGoBack = () => {
    navigate('/dashboard/messages');
  };
  
  const handleRefetch = () => {
    refetchMessages();
    toast({
      title: "Messages refreshed",
      description: "Latest messages loaded",
    });
  };
  
  const groupMessagesByDate = () => {
    if (!messages || messages.length === 0) return {};
    
    const groups: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };
  
  const getDateDisplay = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(dateStr);
    
    if (format(messageDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(messageDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
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
  
  const messageGroups = groupMessagesByDate();
  
  if (isLoadingUserData || isLoadingMessages) {
    return (
      <div className="flex flex-col h-full border-l p-4">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${i % 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }
  
  if (messagesError) {
    return (
      <div className="flex flex-col h-full border-l p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">An error occurred loading the conversation.</p>
            <p className="text-muted-foreground mb-4">Please try again</p>
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
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10 border">
            {getAvatar() ? (
              <AvatarImage src={getAvatar()} alt={getDisplayName()} className="object-cover" />
            ) : isStaff ? (
              <AvatarFallback>
                <Briefcase className="h-4 w-4" />
              </AvatarFallback>
            ) : (
              <AvatarFallback>
                <UserCircle className="h-5 w-5" />
              </AvatarFallback>
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
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefetch}
          title="Refresh Messages"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(messageGroups).length > 0 ? (
          Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
            <div key={dateKey} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {getDateDisplay(dateKey)}
                </div>
              </div>
              <MessageList 
                messages={dateMessages} 
                currentUserId={currentUserId || undefined} 
                onReplyClick={handleReplyClick}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
            <Clock className="h-12 w-12 mb-2 opacity-50" />
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation.</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
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
        {canMessage ? (
          <MessageComposer 
            onSendMessage={handleSendMessage}
            isDisabled={!userId}
            replyToMessage={replyToMessage}
          />
        ) : (
          <div className="text-center text-muted-foreground p-4 border rounded-md bg-muted/50">
            <p>You cannot message this user.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
