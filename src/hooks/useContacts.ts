
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { UserContact } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchContacts, 
  fetchPendingRequests,
  sendContactRequest as sendRequest,
  respondToContactRequest as respondToRequest,
  syncStaffBusinessContacts
} from "@/services/contacts/contactsService";
import {
  fetchAutoApproveSetting,
  updateAutoApproveContacts
} from "@/services/contacts/contactOperations";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [autoApprove, setAutoApprove] = useState<boolean>(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState<boolean>(false);

  // Sync staff-business contacts
  useEffect(() => {
    const syncContacts = async () => {
      try {
        await syncStaffBusinessContacts();
        // After syncing, refresh contacts
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
      } catch (error) {
        console.error("Error syncing staff-business contacts:", error);
      }
    };
    
    syncContacts();
  }, [queryClient]);

  // Fetch user's contacts
  const { 
    data: contacts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });

  // Get pending contact requests
  const { 
    data: pendingRequests, 
    isLoading: isLoadingRequests 
  } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: fetchPendingRequests
  });

  // Fetch auto-approve setting
  useEffect(() => {
    const getAutoApproveSetting = async () => {
      const setting = await fetchAutoApproveSetting();
      setAutoApprove(setting);
    };
    
    getAutoApproveSetting();
  }, []);

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

  // Handle toggling auto-approve setting
  const handleToggleAutoApprove = async () => {
    setIsUpdatingAutoApprove(true);
    try {
      const success = await updateAutoApproveContacts(!autoApprove);
      
      if (success) {
        setAutoApprove(!autoApprove);
        toast({
          title: "Setting Updated",
          description: !autoApprove 
            ? "Contact requests will now be automatically approved" 
            : "Contact requests will now require manual approval"
        });
      }
    } catch (error) {
      console.error("Error updating auto-approve setting:", error);
      toast({
        title: "Update Failed",
        description: "Could not update auto-approve setting",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAutoApprove(false);
    }
  };

  return {
    contacts,
    isLoading,
    error,
    pendingRequests,
    isLoadingRequests,
    autoApprove,
    isUpdatingAutoApprove,
    sendContactRequest,
    respondToContactRequest,
    handleToggleAutoApprove
  };
};
