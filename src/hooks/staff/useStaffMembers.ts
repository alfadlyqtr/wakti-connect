
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StaffMember } from "@/types/staff";

export const useStaffMembers = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Get the current session to check the business ID
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setBusinessId(data.session.user.id);
      }
      return data.session;
    },
  });
  
  // Fetch staff members directly from the database
  const { 
    data: staffMembers, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['staffMembers', businessId],
    queryFn: async () => {
      console.log("Fetching staff members for business ID:", businessId);
      if (!businessId) throw new Error("Business ID not available");
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('*, profiles:staff_id(avatar_url)')
        .eq('business_id', businessId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching staff members:", error);
        throw new Error(error.message);
      }
      
      console.log("Retrieved staff members:", data?.length);
      
      // Convert permissions from JSON if needed
      return data.map(staff => ({
        ...staff,
        permissions: typeof staff.permissions === 'string' 
          ? JSON.parse(staff.permissions) 
          : staff.permissions
      })) as StaffMember[];
    },
    enabled: !!businessId,
    staleTime: 5000, // Consider data fresh for 5 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Function to manually trigger a sync with the server
  const handleSyncStaff = async () => {
    setIsSyncing(true);
    try {
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    } catch (e) {
      console.error("Error syncing staff:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Staff count for checking limits
  const staffCount = staffMembers?.length || 0;
  const canAddMoreStaff = staffCount < 6;
  
  return {
    staffMembers,
    isLoading,
    error,
    refetch,
    canAddMoreStaff,
    handleSyncStaff,
    isSyncing,
    session
  };
};
