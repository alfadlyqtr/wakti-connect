
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/staff';

export const useStaffDetails = (staffRelationId: string | null) => {
  return useQuery({
    queryKey: ['staffDetails', staffRelationId],
    queryFn: async (): Promise<StaffMember | null> => {
      if (!staffRelationId) {
        console.log("No staff relation ID provided");
        return null;
      }
      
      console.log("Fetching staff details for relation ID:", staffRelationId);
      
      try {
        const { data, error } = await supabase
          .from('business_staff')
          .select('*, business_id')
          .eq('id', staffRelationId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching staff details:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          console.log("No staff details found for relation ID:", staffRelationId);
          return null;
        }
        
        console.log("Found staff details:", data);
        
        // Convert string permissions to object if needed
        const parsedPermissions = typeof data.permissions === 'string'
          ? JSON.parse(data.permissions)
          : data.permissions || {};
          
        return {
          ...data,
          permissions: parsedPermissions
        } as StaffMember;
      } catch (error) {
        console.error("Error in useStaffDetails:", error);
        throw error;
      }
    },
    enabled: !!staffRelationId
  });
};
