
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useStaffListOperations = () => {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Delete staff mutation
  const deleteStaff = useMutation({
    mutationFn: async (staffId: string) => {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: 'deleted' })
        .eq('id', staffId);
        
      if (error) throw error;
      return staffId;
    },
    onSuccess: () => {
      toast({
        title: "Staff Deleted",
        description: "Staff member has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting staff",
        variant: "destructive"
      });
    }
  });
  
  // Toggle staff status mutation
  const toggleStaffStatus = useMutation({
    mutationFn: async ({ staffId, newStatus }: { staffId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staffId);
        
      if (error) throw error;
      return { staffId, newStatus };
    },
    onSuccess: (data) => {
      toast({
        title: data.newStatus === 'active' ? "Staff Activated" : "Staff Suspended",
        description: `Staff member has been ${data.newStatus === 'active' ? 'activated' : 'suspended'} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating staff status",
        variant: "destructive"
      });
    }
  });

  // Sync staff records function
  const syncStaffRecords = async () => {
    setIsSyncing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Not authenticated');
      }

      // Call the Supabase Edge Function directly instead of a non-existent API route
      const { data, error } = await supabase.functions.invoke('sync-staff-records', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Staff Synchronized",
        description: `Successfully synchronized ${data?.synced?.length || 0} staff records.`
      });
      
      // Refresh staff list
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync staff records",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    deleteStaff,
    toggleStaffStatus,
    isSyncing,
    syncStaffRecords
  };
};
