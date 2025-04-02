import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { UserContact } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { 
  getUserContacts, 
  getContactRequests,
  sendContactRequest as sendRequest,
  respondToContactRequest as respondToRequest,
  deleteContact as removeContact,
  syncStaffBusinessContacts,
  fetchAutoApproveSetting,
  updateAutoApproveContacts
} from "@/services/contacts";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [autoApprove, setAutoApprove] = useState<boolean>(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState<boolean>(false);
  const [isSyncingContacts, setIsSyncingContacts] = useState<boolean>(false);

  // Sync staff-business contacts on initial load
  useEffect(() => {
    const syncContacts = async () => {
      setIsSyncingContacts(true);
      try {
        await syncStaffBusinessContacts();
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
      } catch (error) {
        console.error("Error syncing staff-business contacts:", error);
      } finally {
        setIsSyncingContacts(false);
      }
    };
    
    syncContacts();
  }, [queryClient]);

  // Fetch user's contacts
  const { 
    data: contacts, 
    isLoading, 
    error,
    refetch: refetchContacts 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  async function fetchContacts() {
    const sessionResponse = await fetch('/api/auth/session');
    const sessionData = await sessionResponse.json();
    
    if (!sessionData?.user?.id) {
      throw new Error('Not authenticated');
    }
    
    return getUserContacts(sessionData.user.id);
  }

  // Get pending contact requests
  const { 
    data: pendingRequests, 
    isLoading: isLoadingRequests,
    refetch: refetchPendingRequests
  } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: fetchPendingRequests,
  });

  async function fetchPendingRequests() {
    const sessionResponse = await fetch('/api/auth/session');
    const sessionData = await sessionResponse.json();
    
    if (!sessionData?.user?.id) {
      throw new Error('Not authenticated');
    }
    
    return getContactRequests(sessionData.user.id);
  }

  // Fetch auto-approve setting
  useEffect(() => {
    const getAutoApproveSetting = async () => {
      try {
        const setting = await fetchAutoApproveSetting();
        setAutoApprove(setting);
      } catch (error) {
        console.error("Error fetching auto approve setting:", error);
      }
    };
    
    getAutoApproveSetting();
  }, []);

  // Handle manual refresh of contacts
  const handleRefreshContacts = async () => {
    setIsSyncingContacts(true);
    try {
      await syncStaffBusinessContacts();
      await refetchContacts();
      await refetchPendingRequests();
      toast({
        title: "Refreshed",
        description: "Your contacts have been refreshed."
      });
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh contacts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncingContacts(false);
    }
  };

  // Send contact request
  const sendContactRequest = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      toast({
        title: "Contact Request Sent",
        description: "Your contact request has been sent successfully."
      });
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

  // Delete contact
  const deleteContact = useMutation({
    mutationFn: removeContact,
    onSuccess: () => {
      toast({
        title: "Contact Removed",
        description: "Contact has been removed successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Contact",
        description: error.message || "An error occurred while removing the contact",
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
    contacts: contacts as UserContact[] | undefined,
    isLoading,
    error,
    pendingRequests: pendingRequests as UserContact[] | undefined,
    isLoadingRequests,
    autoApprove,
    isUpdatingAutoApprove,
    isSyncingContacts,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    refreshContacts: handleRefreshContacts
  };
};
