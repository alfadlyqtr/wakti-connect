
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          throw new Error("Not authenticated");
        }
        
        const businessId = session.session.user.id;
        console.log("Fetching staff for business ID:", businessId);
        
        // First try to fetch from the business_staff table
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('*')
          .eq('business_id', businessId)
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });
          
        if (staffError) {
          console.error("Error fetching staff:", staffError);
          throw staffError;
        }
        
        console.log(`Found ${staffData?.length || 0} staff members:`, staffData);
        
        // If we have no staff members, check if we need to sync
        if (staffData?.length === 0) {
          // Call the sync-staff-records function to sync any missing staff
          try {
            console.log("No staff found, attempting to sync missing staff records");
            const syncResponse = await supabase.functions.invoke("sync-staff-records", {
              headers: {
                Authorization: `Bearer ${session.session.access_token}`
              }
            });
            
            if (syncResponse.error) {
              console.error("Error syncing staff records:", syncResponse.error);
            } else {
              console.log("Sync response:", syncResponse.data);
              
              // If the sync was successful and created records, fetch again
              if (syncResponse.data.success && syncResponse.data.data.synced.length > 0) {
                const { data: refreshedData } = await supabase
                  .from('business_staff')
                  .select('*')
                  .eq('business_id', businessId)
                  .neq('status', 'deleted')
                  .order('created_at', { ascending: false });
                  
                if (refreshedData && refreshedData.length > 0) {
                  console.log("Successfully synced and fetched staff data");
                  toast({
                    title: "Staff Records Synced",
                    description: `Found and added ${syncResponse.data.data.synced.length} missing staff members.`,
                  });
                  return refreshedData as StaffQueryResult[];
                }
              }
            }
          } catch (syncError) {
            console.error("Error during staff sync:", syncError);
          }
        }
        
        return staffData as StaffQueryResult[];
      } catch (error) {
        console.error("Error in staff query:", error);
        throw error;
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};
