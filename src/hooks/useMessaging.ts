
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

export interface UseMessagingOptions {
  otherUserId?: string;
  staffOnly?: boolean;
}

export const useMessaging = (options?: string | UseMessagingOptions) => {
  const queryClient = useQueryClient();
  const isStaff = localStorage.getItem('userRole') === 'staff';
  
  let otherUserId: string | undefined;
  let staffOnly: boolean = false;
  
  if (typeof options === 'string') {
    otherUserId = options;
  } else if (options && typeof options === 'object') {
    otherUserId = options.otherUserId;
    staffOnly = options.staffOnly || false;
  }

  // We don't need to explicitly sync staff contacts anymore since that's handled by DB triggers
  
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

  const { 
    data: canMessage = true,
    isLoading: isCheckingPermission 
  } = useQuery<boolean>({
    queryKey: ['canMessage', otherUserId],
    queryFn: async () => {
      if (!otherUserId) return false;
      
      if (isStaff) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;
        
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('business_id')
          .eq('staff_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (staffData?.business_id === otherUserId) {
          // Staff can always message their business owner
          console.log("Staff can message business owner");
          return true;
        }
        
        // Check if the other user is a staff member in the same business
        const { data: targetIsStaff } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', otherUserId)
          .eq('business_id', staffData?.business_id)
          .maybeSingle();
          
        if (targetIsStaff) {
          // Staff can message other staff of the same business
          console.log("Staff can message other staff");
          return true;
        }
        
        // Default: staff can't message other users
        return false;
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

  const { 
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount
  } = useQuery<number>({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 15000
  });

  const markConversationAsRead = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId)
        .eq('recipient_id', session.user.id)
        .eq('is_read', false);
        
      if (!unreadMessages || unreadMessages.length === 0) return;
      
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
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
