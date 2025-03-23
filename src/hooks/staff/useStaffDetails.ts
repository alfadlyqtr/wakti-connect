
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffDetails {
  id: string;
  name: string;
  role: string;
  permissions: Record<string, boolean>;
  business: {
    business_name: string;
    avatar_url?: string | null;
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
        
        // Check if data exists
        if (!data) {
          console.error("No staff data returned");
          throw new Error("No staff data found");
        }
        
        // Check if business property exists and has the expected structure
        const businessData = data.business;
        if (!businessData || typeof businessData !== 'object' || !('business_name' in businessData)) {
          console.error("Business data is missing or malformed:", businessData);
          
          // Create a default business object to satisfy the type requirement
          data.business = {
            business_name: 'Unknown Business',
            avatar_url: null
          };
        }
        
        // Parse permissions JSON to an object if it's a string
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
        
        // Use type assertion to ensure the return type matches StaffDetails
        return data as StaffDetails;
      } catch (e) {
        console.error("Error fetching staff details:", e);
        throw e;
      }
    },
    enabled: !!staffRelationId
  });
};
