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
        
        // Create a properly formatted staff details object
        const staffDetails: StaffDetails = {
          id: data.id,
          name: data.name || '',
          role: data.role || '',
          staff_id: data.staff_id,
          business_id: data.business_id,
          position: data.position,
          // Make sure business is properly formatted
          business: {
            business_name: 'Unknown Business',
            avatar_url: null
          },
          // Parse permissions properly
          permissions: {}
        };
        
        // Check if business data exists and has the expected structure
        if (data.business && 
            typeof data.business === 'object' && 
            !('error' in data.business) && 
            'business_name' in data.business) {
          // Valid business data, use it
          staffDetails.business = {
            business_name: data.business.business_name,
            avatar_url: data.business.avatar_url
          };
        } else {
          console.error("Business data is missing or malformed:", data.business);
          // Keep the default business object we already set
        }
        
        // Parse permissions JSON to an object if it's a string
        try {
          if (typeof data.permissions === 'string') {
            staffDetails.permissions = JSON.parse(data.permissions);
          } else if (data.permissions && typeof data.permissions === 'object') {
            staffDetails.permissions = data.permissions as Record<string, boolean>;
          }
        } catch (e) {
          console.error("Error parsing permissions:", e);
          // Default permissions already set to empty object
        }
        
        // Copy any other properties we want to keep
        Object.keys(data).forEach(key => {
          if (!['business', 'permissions'].includes(key)) {
            staffDetails[key] = data[key];
          }
        });
        
        return staffDetails;
      } catch (e) {
        console.error("Error fetching staff details:", e);
        throw e;
      }
    },
    enabled: !!staffRelationId
  });
};
