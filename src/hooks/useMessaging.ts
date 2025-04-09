
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  getMessages, 
  sendMessage, 
  markMessageAsRead 
} from "@/services/messages";
import { fetchConversations } from "@/services/messages/fetchConversations";
import { canMessageUser } from "@/services/messages/permissionsService";
import { getUnreadMessagesCount } from "@/services/messages/notificationsService";
import { Message, Conversation } from "@/types/message.types";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

export interface UseMessagingOptions {
  otherUserId?: string;
  staffOnly?: boolean;
}

export const useMessaging = (options?: string | UseMessagingOptions) => {
  const queryClient = useQueryClient();
  const isStaff = localStorage.getItem('userRole') === 'staff';
  const pollingIntervalRef = useRef<number | null>(null);
  
  let otherUserId: string | undefined;
  let staffOnly: boolean = false;
  
  if (typeof options === 'string') {
    otherUserId = options;
  } else if (options && typeof options === 'object') {
    otherUserId = options.otherUserId;
    staffOnly = options.staffOnly || false;
  }

  // Fetch messages
  const { 
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ['messages', otherUserId],
    queryFn: () => otherUserId ? getMessages(otherUserId) : Promise.resolve([]),
    enabled: !!otherUserId,
    refetchInterval: 5000
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
      return sendMessage(recipientId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', otherUserId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "An error occurred while sending the message",
        variant: "destructive"
      });
    }
  });

  // Fetch conversations
  const { 
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch: refetchConversations
  } = useQuery<Conversation[]>({
    queryKey: ['conversations', staffOnly],
    queryFn: () => fetchConversations(staffOnly),
    refetchInterval: 10000
  });

  // Check messaging permissions
  const { 
    data: canMessage = true,
    isLoading: isCheckingPermission 
  } = useQuery<boolean>({
    queryKey: ['canMessage', otherUserId],
    queryFn: async () => {
      if (!otherUserId) return false;
      
      // Check if this is a staff-business conversation
      if (isStaff) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;
        
        // Get staff's business ID
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('business_id')
          .eq('staff_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (staffData) {
          // If the other user is the business owner, staff can message them
          if (staffData?.business_id === otherUserId) {
            console.log("Staff can message business owner");
            return true;
          }
          
          // Check if the other user is a staff member in the same business
          const { data: targetIsStaff } = await supabase
            .from('business_staff')
            .select('id')
            .eq('staff_id', otherUserId)
            .eq('business_id', staffData?.business_id)
            .eq('status', 'active')
            .maybeSingle();
            
          if (targetIsStaff) {
            // Staff can message other staff of the same business
            console.log("Staff can message other staff");
            return true;
          }
        }
      }
      
      // Business owners can message their staff members
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      if (userProfile?.account_type === 'business') {
        // Check if the other user is a staff member of this business
        const { data: isMyStaff } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', otherUserId)
          .eq('business_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (isMyStaff) {
          console.log("Business owner can message their staff");
          return true;
        }
      }
      
      // For other scenarios, use the general permission check
      return canMessageUser(otherUserId);
    },
    enabled: !!otherUserId,
    refetchInterval: 30000
  });

  // Get unread message count
  const { 
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount
  } = useQuery<number>({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 15000
  });

  // Set up real-time updates using Supabase subscription
  useEffect(() => {
    // Clean up the polling interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Mark conversation as read
  const markConversationAsRead = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      // Find unread messages from this user
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId)
        .eq('recipient_id', session.user.id)
        .eq('is_read', false);
        
      if (!unreadMessages || unreadMessages.length === 0) return;
      
      // Mark each message as read
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: ['messages', userId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  return {
    messages,
    isLoadingMessages,
    messagesError,
    refetchMessages,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    conversations,
    isLoadingConversations,
    conversationsError,
    refetchConversations,
    canMessage,
    isCheckingPermission,
    unreadCount,
    isLoadingUnreadCount,
    markConversationAsRead
  };
};
