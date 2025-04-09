import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Send, Mic, MicOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import RecordingCountdown from "./chat/RecordingCountdown";
import MessageList from "./chat/MessageList";

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

// Type guard to check if the profile is a UserProfile
function isUserProfile(profile: UserProfile | StaffProfile): profile is UserProfile {
  return (profile as UserProfile).avatar_url !== undefined || 
         (profile as UserProfile).display_name !== undefined ||
         (profile as UserProfile).account_type !== undefined;
}

const ChatInterface = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
  } = useMessaging(userId);
  
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
    enabled: !!userId
  });

  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setMessage(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text);
      }
    },
    maxRecordingDuration: 10 // 10 seconds max
  });
  
  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (userId) {
      markConversationAsRead(userId);
    }
  }, [userId, markConversationAsRead]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !userId) return;
    
    try {
      await sendMessage({ recipientId: userId, content: message });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const getDisplayName = () => {
    if (!otherUserProfile) return "User";
    
    if ('name' in otherUserProfile) {
      return otherUserProfile.name;
    }
    
    return otherUserProfile.display_name || 
           otherUserProfile.full_name || 
           otherUserProfile.business_name || 
           "User";
  };
  
  const getAvatar = () => {
    if (!otherUserProfile) return null;
    
    // Use the type guard to safely access the correct property
    if (isUserProfile(otherUserProfile)) {
      return otherUserProfile.avatar_url;
    } else {
      return otherUserProfile.profile_image_url;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => navigate('/dashboard/messages')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
          {getAvatar() ? (
            <img 
              src={getAvatar() || ""} 
              alt={getDisplayName()} 
              className="h-full w-full object-cover"
            />
          ) : (
            getDisplayName().charAt(0).toUpperCase()
          )}
        </div>
        
        <div>
          <h3 className="font-medium leading-none">{getDisplayName()}</h3>
          <p className="text-xs text-muted-foreground">
            {isCheckingPermission ? "Checking permissions..." : canMessage ? "Messages expire after 24 hours" : "You cannot message this user"}
          </p>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MessageList messages={messages || []} currentUserId={currentUserId} />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="relative">
          {isListening && (
            <div className="absolute -top-14 left-0 right-0">
              <RecordingCountdown 
                maxDuration={10} 
                isRecording={isListening} 
                onTimeUp={stopListening} 
              />
            </div>
          )}
          <Textarea
            placeholder={canMessage ? "Type your message..." : "You cannot message this user"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`min-h-[80px] resize-none pr-20 ${isListening ? "bg-rose-50 border-rose-200" : ""}`}
            disabled={!canMessage || isSending || isListening}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {supportsVoice && canMessage && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoiceRecording}
                disabled={isSending || !canMessage}
                className={isListening ? "text-rose-500" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending || !canMessage}
              size="icon"
            >
              {isSending ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isListening && (
            <span className="absolute right-12 top-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {isMobile ? "Tap send button to submit your message" : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
