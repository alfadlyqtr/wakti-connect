
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffSession {
  id: string;
  start_time: string;
  end_time: string | null;
  status: string;
  notes: string | null;
  earnings: number;
}

export interface StaffWithSessions {
  id: string;
  name: string;
  role: string;
  position: string;
  created_at: string;
  sessions: StaffSession[];
}

export const useStaffWorkLogs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['staffWorkLogs'],
    queryFn: async () => {
      console.log("Fetching staff work logs...");
      const { data: sessionData } = await supabase.auth.getSession();
      
      console.log("Auth session exists:", !!sessionData.session, "User ID:", sessionData.session?.user?.id);
      
      if (!sessionData?.session?.user) {
        console.error("Not authenticated when fetching staff work logs");
        throw new Error('Not authenticated');
      }
      
      // Check user role
      const { data: userRoleData, error: roleError } = await supabase.rpc(
        "get_auth_user_account_type"
      );
  
      console.log("User role data:", userRoleData, "Error:", roleError);
      
      if (roleError) {
        console.error("Error checking user role:", roleError);
        throw new Error(`Failed to check user role: ${roleError.message}`);
      }
  
      if (userRoleData !== "business") {
        console.log("User is not a business account, role:", userRoleData);
        return [];
      }

      // Fetch staff members
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', sessionData.session.user.id);

      if (staffError) {
        console.error("Error fetching staff members:", staffError);
        throw staffError;
      }

      console.log("Staff members fetched:", staffData?.length || 0);

      if (!staffData || staffData.length === 0) {
        return [];
      }

      // Fetch work logs for each staff member
      const staffWithSessions: StaffWithSessions[] = await Promise.all(
        staffData.map(async (staff) => {
          const { data: sessions, error: sessionsError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', staff.id)
            .order('start_time', { ascending: false });

          if (sessionsError) {
            console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
            return {
              ...staff,
              sessions: []
            };
          }

          return {
            ...staff,
            sessions: sessions || []
          };
        })
      );

      return staffWithSessions;
    }
  });

  return { data, isLoading, error };
};
