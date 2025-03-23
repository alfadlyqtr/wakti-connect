
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffDetails {
  id: string;
  name: string;
  role: string;
  permissions: Record<string, boolean>;
  business: {
    business_name: string;
    avatar_url?: string;
  };
  [key: string]: any;
}

export const useStaffDetails = (staffRelationId: string | null) => {
  return useQuery({
    queryKey: ['staffDetails', staffRelationId],
    queryFn: async (): Promise<StaffDetails | null> => {
      if (!staffRelationId) return null;
      
      try {
        const { data, error } = await supabase
          .from('business_staff')
          .select(`
            *,
            business:business_id (
              business_name,
              avatar_url
            )
          `)
          .eq('id', staffRelationId)
          .single();
          
        if (error) throw error;
        
        // Parse permissions JSON to an object if it's a string
        if (data) {
          try {
            if (typeof data.permissions === 'string') {
              data.permissions = JSON.parse(data.permissions);
            } else if (typeof data.permissions !== 'object') {
              data.permissions = {}; // Default empty object if not valid
            }
          } catch (e) {
            console.error("Error parsing permissions:", e);
            data.permissions = {}; // Default to empty object on parse error
          }
        }
        
        return data as StaffDetails;
      } catch (e) {
        console.error("Error fetching staff details:", e);
        throw e;
      }
    },
    enabled: !!staffRelationId
  });
};
