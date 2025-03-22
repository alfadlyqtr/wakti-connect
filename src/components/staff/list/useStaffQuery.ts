
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
}

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*');
        
      if (staffError) throw staffError;
      return staffData as StaffMember[];
    }
  });
};
