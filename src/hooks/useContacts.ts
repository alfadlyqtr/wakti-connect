
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContact } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchContacts, 
  fetchPendingRequests,
  sendContactRequest as sendRequest,
  respondToContactRequest as respondToRequest
} from "@/services/contacts/contactsService";

export const useContacts = () => {
  const queryClient = useQueryClient();

  // Fetch user's contacts
  const { 
    data: contacts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });

  // Send contact request
  const sendContactRequest = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      toast({
        title: "Contact Request Sent",
        description: "Your contact request has been sent successfully."
      });
      // Invalidate contacts queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Request",
        description: error.message || "An error occurred while sending the contact request",
        variant: "destructive"
      });
    }
  });

  // Respond to contact request
  const respondToContactRequest = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      return respondToRequest(requestId, accept);
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.accept ? "Contact Request Accepted" : "Contact Request Rejected",
        description: variables.accept 
          ? "You have accepted the contact request." 
          : "You have rejected the contact request."
      });
      // Invalidate contacts queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Respond to Request",
        description: error.message || "An error occurred while responding to the contact request",
        variant: "destructive"
      });
    }
  });

  // Get pending contact requests
  const { 
    data: pendingRequests, 
    isLoading: isLoadingRequests 
  } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: fetchPendingRequests
  });

  return {
    contacts,
    isLoading,
    error,
    pendingRequests,
    isLoadingRequests,
    sendContactRequest,
    respondToContactRequest
  };
};
