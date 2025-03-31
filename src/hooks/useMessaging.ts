
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchMessages, 
  sendMessage, 
  fetchConversations,
  canMessageUser,
  getUnreadMessagesCount
} from "@/services/messages";
import { Message, Conversation } from "@/types/message.types";

export const useMessaging = (otherUserId?: string) => {
  const queryClient = useQueryClient();

  // Fetch messages between the current user and another user
  const { 
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ['messages', otherUserId],
    queryFn: () => otherUserId ? fetchMessages(otherUserId) : Promise.resolve([]),
    enabled: !!otherUserId,
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
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
    queryFn: () => otherUserId ? canMessageUser(otherUserId) : Promise.resolve(false),
    enabled: !!otherUserId
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
    isLoadingUnreadCount
  };
};
