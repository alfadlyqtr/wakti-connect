
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ToggleStatusParams {
  staffId: string;
  newStatus: 'active' | 'suspended';
}

export function useStaffStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const toggleStatus = useMutation({
    mutationFn: async ({ staffId, newStatus }: ToggleStatusParams) => {
      const { error } = await supabase
        .from('business_staff')
        .update({ status: newStatus })
        .eq('id', staffId);
        
      if (error) throw error;
      return { staffId, newStatus };
    },
    onSuccess: (data) => {
      const statusText = data.newStatus === 'active' ? 'activated' : 'suspended';
      toast({
        title: `Staff ${statusText}`,
        description: `Staff member has been ${statusText} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff status",
        variant: "destructive"
      });
    }
  });
  
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
        description: error.message || "Failed to delete staff member",
        variant: "destructive"
      });
    }
  });
  
  return {
    toggleStatus,
    deleteStaff
  };
}
