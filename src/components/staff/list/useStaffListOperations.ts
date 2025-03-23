
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types/staff";

export const useStaffListOperations = () => {
  const queryClient = useQueryClient();
  
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
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
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
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating staff status",
        variant: "destructive"
      });
    }
  });
  
  return {
    deleteStaff,
    toggleStaffStatus
  };
};
