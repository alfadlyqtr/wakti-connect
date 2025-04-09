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
import { forceSyncStaffContacts } from "@/services/contacts/contactSync";
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

  useQuery({
    queryKey: ['syncStaffContacts'],
    queryFn: async () => {
      if (isStaff) {
        try {
          const syncResult = await forceSyncStaffContacts();
          console.log("Staff contacts sync result:", syncResult);
          
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return false;
          
          const businessId = await getStaffBusinessId();
          if (!businessId) return false;
          
          await supabase.from('user_contacts').upsert({
            user_id: session.user.id,
            contact_id: businessId,
            status: 'accepted',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
          await supabase.from('user_contacts').upsert({
            user_id: businessId,
            contact_id: session.user.id,
            status: 'accepted',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
          const { data: otherStaff } = await supabase
            .from('business_staff')
            .select('staff_id')
            .eq('business_id', businessId)
            .eq('status', 'active')
            .neq('staff_id', session.user.id);
            
          if (otherStaff && otherStaff.length > 0) {
            for (const staff of otherStaff) {
              await supabase.from('user_contacts').upsert({
                user_id: session.user.id,
                contact_id: staff.staff_id,
                status: 'accepted',
                updated_at: new Date().toISOString()
              }, { onConflict: 'user_id,contact_id' });
              
              await supabase.from('user_contacts').upsert({
                user_id: staff.staff_id,
                contact_id: session.user.id,
                status: 'accepted',
                updated_at: new Date().toISOString()
              }, { onConflict: 'user_id,contact_id' });
            }
          }
          
          return true;
        } catch (error) {
          console.error("Error syncing staff contacts:", error);
          return false;
        }
      }
      return false;
    },
    refetchOnMount: true,
    refetchInterval: 60000
  });

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
      if (isStaff) {
        try {
          const businessId = await getStaffBusinessId();
          
          if (businessId === recipientId) {
            await forceSyncStaffContacts();
          } else {
            const { data: staffData } = await supabase
              .from('business_staff')
              .select('id')
              .eq('staff_id', recipientId)
              .eq('business_id', businessId)
              .eq('status', 'active')
              .maybeSingle();
              
            if (staffData) {
              await supabase.from('user_contacts').upsert({
                user_id: (await supabase.auth.getUser()).data.user?.id,
                contact_id: recipientId,
                status: 'accepted',
                updated_at: new Date().toISOString()
              }, { onConflict: 'user_id,contact_id' });
              
              await supabase.from('user_contacts').upsert({
                user_id: recipientId,
                contact_id: (await supabase.auth.getUser()).data.user?.id,
                status: 'accepted',
                updated_at: new Date().toISOString()
              }, { onConflict: 'user_id,contact_id' });
            }
          }
        } catch (error) {
          console.error("Error syncing contacts before sending message:", error);
        }
      }
      
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
          return true;
        }
        
        const { data: targetIsStaff } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', otherUserId)
          .eq('business_id', staffData?.business_id)
          .maybeSingle();
          
        if (targetIsStaff) {
          return true;
        }
        
        return false;
      }
      
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
