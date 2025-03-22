
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StaffMember } from "@/pages/dashboard/staff-management/types";

export const useStaffListOperations = () => {
  const queryClient = useQueryClient();
  
  // Fetch staff members
  const { 
    data: staffMembers, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          *,
          profiles:staff_id (
            avatar_url,
            full_name
          )
        `)
        .eq('business_id', session.user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Map the data to match our StaffMember interface
      return (data as any[]).map(staff => {
        const profileData = staff.profiles ? {
          avatar_url: staff.profiles.avatar_url,
          full_name: staff.profiles.full_name
        } : null;

        return {
          ...staff,
          permissions: typeof staff.permissions === 'string' 
            ? JSON.parse(staff.permissions) 
            : staff.permissions,
          profile: profileData
        } as StaffMember;
      });
    }
  });
  
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
  
  return {
    staffMembers,
    isLoading,
    error,
    deleteStaff,
    toggleStaffStatus
  };
};
