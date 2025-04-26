
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StaffMember } from "../../domain/types";
import { staffService } from "../../domain/services/staffService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useStaffMembers = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query to fetch staff members
  const {
    data: staffMembers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      return await staffService.getStaffMembers();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to check if can add more staff
  const {
    data: canAddMoreStaff = true,
    isLoading: isCheckingStaffLimit
  } = useQuery({
    queryKey: ['canAddMoreStaff'],
    queryFn: async () => {
      return await staffService.canAddMoreStaff();
    }
  });
  
  // Mutation to delete staff
  const deleteStaff = useMutation({
    mutationFn: async (staffId: string) => {
      return await staffService.deleteStaffMember(staffId);
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
  
  // Mutation to toggle staff status
  const toggleStaffStatus = useMutation({
    mutationFn: async ({ staffId, newStatus }: { staffId: string; newStatus: string }) => {
      return await staffService.updateStaffStatus(staffId, newStatus);
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.newStatus === 'active' ? "Staff Activated" : "Staff Suspended",
        description: `Staff member has been ${variables.newStatus === 'active' ? 'activated' : 'suspended'} successfully.`
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
  
  // Function to sync staff records
  const handleSyncStaff = async () => {
    setIsSyncing(true);
    try {
      // Get current user session for auth
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Staff Synchronizing",
        description: "Refreshing staff data..."
      });
      
      // Invalidate and refetch staff data
      await queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      await refetch();
      
      toast({
        title: "Staff Synchronized",
        description: "Successfully refreshed staff records."
      });
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
    staffMembers,
    isLoading,
    error,
    refetch,
    deleteStaff,
    toggleStaffStatus,
    canAddMoreStaff,
    isCheckingStaffLimit,
    handleSyncStaff,
    isSyncing
  };
};
