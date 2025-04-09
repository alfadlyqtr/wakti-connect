
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
import { ensureStaffContacts, forceSyncStaffContacts } from "@/services/contacts/contactSync";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";

export const useMessaging = (otherUserId?: string) => {
  const queryClient = useQueryClient();

  // First ensure that staff contacts are synced
  useQuery({
    queryKey: ['syncStaffContacts'],
    queryFn: async () => {
      const isStaff = localStorage.getItem('userRole') === 'staff';
      if (isStaff) {
        try {
          // Force sync staff contacts to ensure messaging works
          await forceSyncStaffContacts();
          
          // Get current user session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return false;
          
          // Check if business ID is available
          const businessId = await getStaffBusinessId();
          if (!businessId) return false;
          
          // Directly create contact relationship between staff and business
          await supabase.from('user_contacts').upsert({
            user_id: session.user.id,
            contact_id: businessId,
            status: 'accepted',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
          // And the reverse direction
          await supabase.from('user_contacts').upsert({
            user_id: businessId,
            contact_id: session.user.id,
            status: 'accepted',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
          return true;
        } catch (error) {
          console.error("Error syncing staff contacts:", error);
          return false;
        }
      }
      return false;
    },
    refetchOnMount: true,
    refetchInterval: 60000 // Check every minute
  });

  // Fetch messages between the current user and another user
  const { 
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ['messages', otherUserId],
    queryFn: () => otherUserId ? getMessages(otherUserId) : Promise.resolve([]),
    enabled: !!otherUserId,
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
      // For staff users, ensure contacts are synced before sending
      const isStaff = localStorage.getItem('userRole') === 'staff';
      if (isStaff) {
        const businessId = await getStaffBusinessId();
        if (businessId === recipientId) {
          // Make sure the connection exists
          await forceSyncStaffContacts();
        }
      }
      
      return sendMessage(recipientId, content);
    },
    onSuccess: () => {
      // Invalidate messages and conversations queries to refetch updated data
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

  // Get conversations list
  const { 
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError
  } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    refetchInterval: 10000 // Auto-refresh every 10 seconds
  });

  // Check if the current user can message a given user
  const { 
    data: canMessage = false,
    isLoading: isCheckingPermission 
  } = useQuery<boolean>({
    queryKey: ['canMessage', otherUserId],
    queryFn: async () => {
      if (!otherUserId) return false;
      
      // Staff members can always message their business owner
      const isStaff = localStorage.getItem('userRole') === 'staff';
      if (isStaff) {
        // Get business ID with fresh data (don't rely on cache)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;
        
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('business_id')
          .eq('staff_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (staffData?.business_id === otherUserId) {
          // Always allow staff to message business owner
          return true;
        }
        
        // Check if target is another staff member
        const { data: targetIsStaff } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', otherUserId)
          .eq('business_id', staffData?.business_id)
          .maybeSingle();
          
        if (targetIsStaff) {
          // Allow staff to message other staff
          return true;
        }
      }
      
      // For all other cases, use the standard permission check
      return canMessageUser(otherUserId);
    },
    enabled: !!otherUserId,
    refetchInterval: 30000 // Check permissions every 30 seconds
  });

  // Get unread messages count
  const { 
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount
  } = useQuery<number>({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 15000 // Auto-refresh every 15 seconds
  });

  // Mark a conversation with a user as read
  const markConversationAsRead = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      // Get all unread messages from this user
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId)
        .eq('recipient_id', session.user.id)
        .eq('is_read', false);
        
      if (!unreadMessages || unreadMessages.length === 0) return;
      
      // Mark all as read
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Invalidate queries
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
    canMessage,
    isCheckingPermission,
    unreadCount,
    isLoadingUnreadCount,
    markConversationAsRead
  };
};
