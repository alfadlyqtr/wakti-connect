
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";

// Local StaffMember interface matching the DB response
export interface StaffQueryResult {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
  business_id: string;
  status?: string;
  is_service_provider?: boolean;
  permissions?: Record<string, boolean>;
  staff_number?: string;
  profile_image_url?: string;
}

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }
      
      const businessId = session.session.user.id;
      console.log("Fetching staff for business ID:", businessId);
      
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', businessId);
        
      if (staffError) throw staffError;
      
      console.log(`Found ${staffData?.length || 0} staff members`);
      
      return staffData as StaffQueryResult[];
    }
  });
};
