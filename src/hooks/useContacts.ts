
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  getUserContacts, 
  getContactRequests, 
  getStaffContacts,
  sendContactRequest as sendRequest,
  respondToContactRequest as respondToRequest,
  deleteContact as deleteContactRequest,
  fetchAutoApproveSetting,
  updateAutoApproveContacts,
  syncStaffBusinessContacts,
  fetchAutoAddStaffSetting,
  updateAutoAddStaffSetting
} from '@/services/contacts';
import { UserContact } from '@/types/invitation.types';

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Get the current user ID
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    checkSession();
  }, []);

  // Regular contacts query
  const { 
    data: contacts, 
    isLoading, 
    refetch: refreshContacts 
  } = useQuery({
    queryKey: ['contacts', userId],
    queryFn: () => userId ? getUserContacts(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Staff contacts query 
  const { 
    data: staffContacts, 
    isLoading: isLoadingStaffContacts
  } = useQuery({
    queryKey: ['staff-contacts', userId],
    queryFn: () => userId ? getStaffContacts(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Contact requests query
  const { 
    data: pendingRequests = { incoming: [], outgoing: [] }, 
    isLoading: isLoadingRequests,
    refetch: refreshRequests
  } = useQuery({
    queryKey: ['contact-requests', userId],
    queryFn: () => userId ? getContactRequests(userId) : Promise.resolve({ incoming: [], outgoing: [] }),
    enabled: !!userId,
  });

  // Auto-approve setting
  const { 
    data: autoApprove = false, 
    isLoading: isLoadingAutoApprove,
    refetch: refreshAutoApprove 
  } = useQuery({
    queryKey: ['auto-approve-setting', userId],
    queryFn: () => fetchAutoApproveSetting(),
    enabled: !!userId,
  });

  // Auto-add staff setting
  const { 
    data: autoAddStaff = true, 
    isLoading: isLoadingAutoAddStaff
  } = useQuery({
    queryKey: ['auto-add-staff-setting', userId],
    queryFn: () => fetchAutoAddStaffSetting(),
    enabled: !!userId,
  });

  // Mutations
  const sendContactRequest = useMutation({
    mutationFn: (contactId: string) => sendRequest(contactId),
    onSuccess: () => {
      toast({
        title: "Contact request sent",
        description: "The user will be notified of your request.",
      });
      refreshRequests();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send contact request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const respondToContactRequest = useMutation({
    mutationFn: ({ requestId, accept }: { requestId: string; accept: boolean }) => 
      respondToRequest(requestId, accept),
    onSuccess: () => {
      toast({
        title: "Request processed",
        description: "The contact request has been processed.",
      });
      refreshRequests();
      refreshContacts();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to process request: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: (contactId: string) => deleteContactRequest(contactId),
    onSuccess: () => {
      toast({
        title: "Contact deleted",
        description: "The contact has been removed from your list.",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete contact: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleAutoApprove = useMutation({
    mutationFn: (value: boolean) => updateAutoApproveContacts(value),
    onSuccess: () => {
      toast({
        title: "Setting updated",
        description: "Auto-approve contacts setting has been updated.",
      });
      refreshAutoApprove();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update setting: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleAutoAddStaff = useMutation({
    mutationFn: (value: boolean) => updateAutoAddStaffSetting(value),
    onSuccess: () => {
      toast({
        title: "Setting updated",
        description: "Auto-add staff setting has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['auto-add-staff-setting'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update setting: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const syncContacts = async () => {
    setIsSyncing(true);
    try {
      await syncStaffBusinessContacts();
      toast({
        title: "Contacts synced",
        description: "Your contacts have been synchronized.",
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['staff-contacts'] });
    } catch (error) {
      console.error("Error syncing contacts:", error);
      toast({
        title: "Sync failed",
        description: "Could not sync contacts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    contacts,
    staffContacts,
    pendingRequests,
    autoApprove,
    autoAddStaff,
    isLoading,
    isLoadingRequests,
    isLoadingStaffContacts,
    isUpdatingAutoApprove: toggleAutoApprove.isPending,
    isUpdatingAutoAddStaff: toggleAutoAddStaff.isPending,
    isSyncingContacts: isSyncing,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove: (value: boolean) => toggleAutoApprove.mutate(value),
    handleToggleAutoAddStaff: (value: boolean) => toggleAutoAddStaff.mutate(value),
    refreshContacts: syncContacts
  };
};
