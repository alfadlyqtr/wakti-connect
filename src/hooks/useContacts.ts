
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  getUserContacts, 
  getContactRequests, 
  getStaffContacts,
  sendContactRequest as apiSendContactRequest,
  respondToContactRequest as apiRespondToContactRequest,
  deleteContact as apiDeleteContact,
  fetchAutoApproveSetting,
  updateAutoApproveContacts
} from '@/services/contacts';
import { supabase } from '@/integrations/supabase/client';
import { UserContact, ContactRequestStatus } from '@/types/invitation.types';

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [autoApprove, setAutoApprove] = useState(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState(false);
  
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    getUserId();
  }, []);
  
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

  const {
    data: pendingRequestsData,
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['contactRequests', userId],
    queryFn: async () => {
      if (!userId) return { incomingRequests: [], outgoingRequests: [] };
      console.log("[useContacts] Fetching contact requests for user:", userId);
      
      // Get incoming requests
      const incomingRequests = await getContactRequests(userId);
      
      // Fetch outgoing requests
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('user_contacts')
        .select(`
          id,
          user_id,
          contact_id,
          status,
          staff_relation_id,
          created_at
        `)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .is('staff_relation_id', null);

      if (outgoingError) {
        console.error("[useContacts] Error fetching outgoing requests:", outgoingError);
        return { incomingRequests: [], outgoingRequests: [] };
      }
      
      // Log the raw outgoing requests data for debugging
      console.log("[useContacts] Raw outgoing requests data:", outgoingData);
      
      // Separately fetch profile data for contacts
      const outgoingRequests = await Promise.all(outgoingData.map(async (request) => {
        // Fetch profile data separately to avoid RLS issues
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            display_name,
            avatar_url,
            account_type,
            business_name,
            email
          `)
          .eq('id', request.contact_id)
          .single();
          
        if (profileError) {
          console.error(`[useContacts] Error fetching profile for contact ${request.contact_id}:`, profileError);
        }
        
        // Create a properly formatted contact object, using available profile data or fallbacks
        return {
          id: request.id,
          userId: request.user_id,
          contactId: request.contact_id,
          status: request.status as "accepted" | "pending" | "rejected",
          staffRelationId: request.staff_relation_id,
          created_at: request.created_at,
          contactProfile: {
            id: profileData?.id || request.contact_id,
            fullName: profileData?.full_name || null,
            displayName: profileData?.display_name || null,
            avatarUrl: profileData?.avatar_url || null,
            accountType: profileData?.account_type || null,
            businessName: profileData?.business_name || null,
            email: profileData?.email || request.contact_id
          }
        } as UserContact;
      }));

      // Log the processed requests for debugging
      console.log("[useContacts] Fetched requests:", {
        incoming: incomingRequests.length,
        outgoing: outgoingRequests.length
      });
      
      console.log("[useContacts] Processed outgoing requests:", outgoingRequests);

      return {
        incomingRequests,
        outgoingRequests
      };
    },
    enabled: !!userId
  });
  
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
  
  const refreshContacts = async () => {
    console.log("[useContacts] Refreshing contact data");
    await Promise.all([
      refetchContacts(),
      refetchRequests(),
      refetchStaffContacts()
    ]);
    
    queryClient.invalidateQueries({queryKey: ['dashboardContactsCount']});
  };

  return {
    contacts,
    isLoading,
    staffContacts,
    isLoadingStaffContacts,
    pendingRequests: {
      incoming: pendingRequestsData?.incomingRequests || [],
      outgoing: pendingRequestsData?.outgoingRequests || []
    },
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
