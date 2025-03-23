
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types/staff";

export function useStaffMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Fetch authenticated session
  const { data: sessionData } = useQuery({
    queryKey: ['sessionData'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    }
  });
  
  // Fetch staff members
  const { 
    data: staffMembersData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      if (!sessionData?.session?.user?.id) {
        throw new Error("Not authenticated");
      }
      
      const businessId = sessionData.session.user.id;
      console.log("Fetching staff for business:", businessId);
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', businessId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching staff:", error);
        throw new Error(error.message || "Failed to fetch staff members");
      }
      
      console.log(`Found ${data?.length || 0} staff members:`, data);
      
      return data || [];
    },
    enabled: !!sessionData?.session?.user?.id,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Transform raw data to StaffMember type
  const staffMembers: StaffMember[] = (staffMembersData || []).map(staff => ({
    id: staff.id,
    staff_id: staff.staff_id,
    business_id: staff.business_id,
    name: staff.name,
    email: staff.email,
    position: staff.position || '',
    role: staff.role,
    status: staff.status,
    is_service_provider: !!staff.is_service_provider,
    permissions: typeof staff.permissions === 'string' 
      ? JSON.parse(staff.permissions as string) 
      : staff.permissions || {},
    staff_number: staff.staff_number || '',
    profile_image_url: staff.profile_image_url,
    created_at: staff.created_at
  }));

  // Sync staff records function
  const handleSyncStaff = async () => {
    if (!sessionData?.session?.access_token) {
      toast({
        title: "Error",
        description: "You must be signed in to sync staff records",
        variant: "destructive"
      });
      return;
    }
    
    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("sync-staff-records", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });
      
      if (error) {
        console.error("Error syncing staff records:", error);
        toast({
          title: "Sync Failed",
          description: error.message || "Failed to sync staff records",
          variant: "destructive"
        });
        return;
      }
      
      if (data.success) {
        const syncedCount = data.data.synced.length;
        
        toast({
          title: "Staff Records Synced",
          description: syncedCount > 0 
            ? `Successfully synced ${syncedCount} staff records.` 
            : "All staff records are already in sync.",
          variant: "default"
        });
        
        queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
        refetch();
      } else {
        toast({
          title: "Sync Failed",
          description: data.error || "Failed to sync staff records",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error in sync operation:", err);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Count staff and determine if more can be added
  const staffCount = staffMembers?.length || 0;
  const canAddMoreStaff = staffCount < 6;

  return {
    staffMembers,
    isLoading, 
    error, 
    refetch,
    isSyncing,
    handleSyncStaff,
    staffCount,
    canAddMoreStaff
  };
}
