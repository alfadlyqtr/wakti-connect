import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { UserContact } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getUserContacts, 
  getContactRequests,
  sendContactRequest as sendRequest,
  respondToContactRequest as respondToRequest,
  deleteContact as removeContact,
  syncStaffBusinessContacts,
  fetchAutoApproveSetting,
  updateAutoApproveContacts,
  fetchAutoAddStaffSetting,
  updateAutoAddStaffSetting
} from "@/services/contacts";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const [autoApprove, setAutoApprove] = useState<boolean>(false);
  const [autoAddStaff, setAutoAddStaff] = useState<boolean>(true);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState<boolean>(false);
  const [isUpdatingAutoAddStaff, setIsUpdatingAutoAddStaff] = useState<boolean>(false);
  const [isSyncingContacts, setIsSyncingContacts] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{success: boolean; message: string} | null>(null);

  // Sync staff-business contacts on initial load
  useEffect(() => {
    const syncContacts = async () => {
      setIsSyncingContacts(true);
      try {
        console.log("[useContacts] Starting staff-business contacts sync");
        const result = await syncStaffBusinessContacts();
        setSyncResult(result);
        console.log("[useContacts] Sync result:", result);
        
        if (result.success) {
          console.log("[useContacts] Sync successful, invalidating contacts query");
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
        }
      } catch (error) {
        console.error("[useContacts] Error syncing staff-business contacts:", error);
        setSyncResult({
          success: false,
          message: error.message || "Failed to sync contacts"
        });
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
    try {
      console.log("[useContacts] Starting fetchContacts");
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user?.id) {
        console.error("[useContacts] No authenticated user found");
        throw new Error('Not authenticated');
      }
      
      console.log('[useContacts] Fetching contacts for authenticated user:', data.session.user.id);
      const contactsData = await getUserContacts(data.session.user.id);
      console.log(`[useContacts] Retrieved ${contactsData.length} contacts:`, contactsData);
      
      // Check contact statuses
      const acceptedContacts = contactsData.filter(contact => contact.status === 'accepted');
      console.log(`[useContacts] Accepted contacts: ${acceptedContacts.length}/${contactsData.length}`);
      
      // Log contact profiles to see if they're properly populated
      contactsData.forEach((contact, index) => {
        console.log(`[useContacts] Contact ${index + 1}: id=${contact.id}, status=${contact.status}`, 
          contact.contactProfile ? 
          `profile=${contact.contactProfile.displayName || contact.contactProfile.fullName || 'Unknown'}` : 
          'No profile data');
      });
      
      return contactsData;
    } catch (error) {
      console.error('[useContacts] Error in fetchContacts:', error);
      throw error;
    }
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
    try {
      console.log("[useContacts] Starting fetchPendingRequests");
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user?.id) {
        console.error("[useContacts] No authenticated user found for pending requests");
        throw new Error('Not authenticated');
      }
      
      console.log('[useContacts] Fetching pending requests for user:', data.session.user.id);
      const pendingData = await getContactRequests(data.session.user.id);
      console.log(`[useContacts] Retrieved ${pendingData.length} pending requests`);
      
      return pendingData;
    } catch (error) {
      console.error('[useContacts] Error in fetchPendingRequests:', error);
      throw error;
    }
  }

  // Fetch auto-approve setting
  useEffect(() => {
    const getAutoApproveSetting = async () => {
      try {
        const setting = await fetchAutoApproveSetting();
        setAutoApprove(setting);
        console.log("[useContacts] Auto-approve setting:", setting);
      } catch (error) {
        console.error("[useContacts] Error fetching auto approve setting:", error);
      }
    };
    
    getAutoApproveSetting();
  }, []);
  
  // Fetch auto-add staff setting
  useEffect(() => {
    const getAutoAddStaffSetting = async () => {
      try {
        const setting = await fetchAutoAddStaffSetting();
        setAutoAddStaff(setting);
        console.log("[useContacts] Auto-add staff setting:", setting);
      } catch (error) {
        console.error("[useContacts] Error fetching auto add staff setting:", error);
      }
    };
    
    getAutoAddStaffSetting();
  }, []);

  // Handle manual refresh of contacts
  const handleRefreshContacts = async () => {
    setIsSyncingContacts(true);
    setSyncResult(null);
    try {
      console.log("[useContacts] Starting manual refresh of contacts");
      const result = await syncStaffBusinessContacts();
      setSyncResult(result);
      console.log("[useContacts] Manual sync result:", result);
      
      console.log("[useContacts] Refetching contacts and pending requests");
      await refetchContacts();
      await refetchPendingRequests();
      
      toast({
        title: result.success ? "Refreshed" : "Refresh Warning",
        description: result.message || "Your contacts have been refreshed.",
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("[useContacts] Error refreshing contacts:", error);
      setSyncResult({
        success: false,
        message: error.message || "Failed to refresh contacts"
      });
      
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
  
  // Handle toggling auto-add staff setting
  const handleToggleAutoAddStaff = async () => {
    setIsUpdatingAutoAddStaff(true);
    try {
      const success = await updateAutoAddStaffSetting(!autoAddStaff);
      
      if (success) {
        setAutoAddStaff(!autoAddStaff);
        toast({
          title: "Setting Updated",
          description: !autoAddStaff 
            ? "Staff members will be automatically added to contacts" 
            : "Staff members will not be automatically added to contacts"
        });
      }
    } catch (error) {
      console.error("Error updating auto-add staff setting:", error);
      toast({
        title: "Update Failed",
        description: "Could not update auto-add staff setting",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAutoAddStaff(false);
    }
  };

  return {
    contacts: contacts as UserContact[] | undefined,
    isLoading,
    error,
    pendingRequests: pendingRequests as UserContact[] | undefined,
    isLoadingRequests,
    autoApprove,
    autoAddStaff,
    isUpdatingAutoApprove,
    isUpdatingAutoAddStaff,
    isSyncingContacts,
    syncResult,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    handleToggleAutoAddStaff,
    refreshContacts: handleRefreshContacts
  };
};
