import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  getMessages, 
  sendMessage as sendMessageService, 
  markMessageAsRead,
  canMessageUser,
  getUnreadMessagesCount,
  markConversationAsRead as markConversationAsReadService
} from "@/services/messages";
import { fetchConversations } from "@/services/messages/fetchConversations";
import { Message, Conversation } from "@/types/message.types";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

export interface UseMessagingOptions {
  otherUserId?: string;
  staffOnly?: boolean;
}

export interface SendMessageParams {
  recipientId: string;
  content: string | null;
  type?: 'text' | 'voice' | 'image';
  audioUrl?: string;
  imageUrl?: string;
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
    mutationFn: async ({ 
      recipientId, 
      content, 
      type = 'text',
      audioUrl,
      imageUrl
    }: SendMessageParams) => {
      return sendMessageService(recipientId, content, type, audioUrl, imageUrl);
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
    isLoading: isCheckingPermission,
    error: permissionError,
    refetch: recheckPermissions
  } = useQuery<boolean>({
    queryKey: ['canMessage', otherUserId],
    queryFn: async () => {
      if (!otherUserId) return false;
      
      try {
        const result = await canMessageUser(otherUserId);
        console.log("Permission check result:", { canMessage: result, userId: otherUserId });
        return result;
      } catch (error) {
        console.error("Error checking messaging permissions:", error);
        return false;
      }
    },
    enabled: !!otherUserId,
    retry: 2,
    staleTime: 30000,
    meta: {
      onError: (error: any) => {
        console.error("Error checking messaging permissions:", error);
        toast({
          title: "Permission Check Failed",
          description: "Unable to verify messaging permissions. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const { 
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount
  } = useQuery<number>({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessagesCount,
    refetchInterval: 15000
  });

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const markConversationAsRead = async (userId: string) => {
    try {
      await markConversationAsReadService(userId);
      
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
    permissionError,
    recheckPermissions,
    unreadCount,
    isLoadingUnreadCount,
    markConversationAsRead
  };
};
