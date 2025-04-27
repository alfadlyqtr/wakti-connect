
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  getUserContacts, 
  getContactRequests, 
  sendContactRequest as apiSendContactRequest,
  respondToContactRequest as apiRespondToContactRequest,
  deleteContact as apiDeleteContact,
  fetchAutoApproveSetting,
  updateAutoApproveContacts,
  getStaffContacts
} from '@/services/contacts';
import { supabase } from '@/integrations/supabase/client';
import { UserContact } from '@/types/invitation.types';

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [autoApprove, setAutoApprove] = useState(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState(false);
  
  // Use state to track userId
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    getUserId();
  }, []);
  
  // Load auto-approve setting
  useEffect(() => {
    if (userId) {
      const loadAutoApprove = async () => {
        try {
          const setting = await fetchAutoApproveSetting();
          setAutoApprove(setting);
        } catch (error) {
          console.error("Error loading auto-approve setting:", error);
        }
      };
      
      loadAutoApprove();
    }
  }, [userId]);

  // Get regular contacts
  const {
    data: contacts,
    isLoading,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['contacts', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log("[useContacts] Fetching regular contacts for user:", userId);
      const contacts = await getUserContacts(userId);
      console.log("[useContacts] Fetched regular contacts:", contacts);
      return contacts;
    },
    enabled: !!userId
  });
  
  // Get staff contacts
  const {
    data: staffContacts,
    isLoading: isLoadingStaffContacts,
    refetch: refetchStaffContacts
  } = useQuery({
    queryKey: ['staffContacts', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log("[useContacts] Fetching staff contacts for user:", userId);
      const contacts = await getStaffContacts(userId);
      console.log("[useContacts] Fetched staff contacts:", contacts);
      return contacts;
    },
    enabled: !!userId
  });

  // Get pending contact requests
  const {
    data: pendingRequests,
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['contactRequests', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log("[useContacts] Fetching contact requests for user:", userId);
      const requests = await getContactRequests(userId);
      console.log("[useContacts] Fetched contact requests:", requests);
      return requests;
    },
    enabled: !!userId
  });
  
  // Send contact request mutation
  const sendContactRequest = useMutation({
    mutationFn: async (contactId: string) => {
      if (!userId) throw new Error('Not authenticated');
      return await apiSendContactRequest(contactId);
    },
    onSuccess: () => {
      toast({
        title: "Contact request sent",
        description: "The user will be notified of your request.",
      });
      queryClient.invalidateQueries({queryKey: ['contacts']});
      queryClient.invalidateQueries({queryKey: ['contactRequests']});
    },
    onError: (error) => {
      console.error("Error sending contact request:", error);
      toast({
        title: "Error",
        description: "Could not send contact request.",
        variant: "destructive",
      });
    }
  });
  
  // Respond to contact request mutation
  const respondToContactRequest = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string, accept: boolean }) => {
      if (!userId) throw new Error('Not authenticated');
      return await apiRespondToContactRequest(requestId, accept);
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.accept ? "Contact accepted" : "Contact rejected",
        description: variables.accept 
          ? "Contact has been added to your list." 
          : "Contact request has been rejected.",
      });
      queryClient.invalidateQueries({queryKey: ['contacts']});
      queryClient.invalidateQueries({queryKey: ['contactRequests']});
    },
    onError: (error) => {
      console.error("Error responding to contact request:", error);
      toast({
        title: "Error",
        description: "Could not update contact request.",
        variant: "destructive",
      });
    }
  });
  
  // Delete contact mutation
  const deleteContact = useMutation({
    mutationFn: async (contactId: string) => {
      if (!userId) throw new Error('Not authenticated');
      return await apiDeleteContact(contactId);
    },
    onSuccess: () => {
      toast({
        title: "Contact removed",
        description: "Contact has been removed from your list.",
      });
      queryClient.invalidateQueries({queryKey: ['contacts']});
      queryClient.invalidateQueries({queryKey: ['dashboardContactsCount']});
    },
    onError: (error) => {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Could not remove contact.",
        variant: "destructive",
      });
    }
  });
  
  const handleToggleAutoApprove = async () => {
    setIsUpdatingAutoApprove(true);
    try {
      await updateAutoApproveContacts(!autoApprove);
      setAutoApprove(!autoApprove);
      
      toast({
        title: "Setting Updated",
        description: !autoApprove 
          ? "Contact requests will be automatically approved" 
          : "Contact requests require manual approval"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update setting",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAutoApprove(false);
    }
  };
  
  // Function to refresh data
  const refreshContacts = async () => {
    console.log("[useContacts] Refreshing contact data");
    await Promise.all([
      refetchContacts(),
      refetchRequests(),
      refetchStaffContacts()
    ]);
    
    // Also refresh dashboard count
    queryClient.invalidateQueries({queryKey: ['dashboardContactsCount']});
  };

  return {
    contacts,
    isLoading,
    staffContacts,
    isLoadingStaffContacts,
    pendingRequests,
    isLoadingRequests,
    isSyncingContacts: sendContactRequest.isPending,
    autoApprove,
    isUpdatingAutoApprove,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    refreshContacts
  };
};

// Import useState at the top
import { useState } from 'react';
