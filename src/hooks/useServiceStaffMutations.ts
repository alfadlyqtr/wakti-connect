
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useServiceStaffMutations = () => {
  const queryClient = useQueryClient();
  
  // Improved mutation to assign staff members to a service with better error handling and performance
  const staffAssignmentMutation = useMutation({
    mutationFn: async ({ 
      serviceId, 
      staffIds 
    }: { 
      serviceId: string, 
      staffIds: string[] 
    }) => {
      try {
        console.log("Starting staff assignment mutation:", { serviceId, staffIds });
        
        // Get service details for notification - caching this would improve performance
        const { data: serviceData, error: serviceError } = await supabase
          .from('business_services')
          .select('name, business_id')
          .eq('id', serviceId)
          .single();
          
        if (serviceError) {
          console.error("Error fetching service data:", serviceError);
          throw new Error(`Failed to fetch service data: ${serviceError.message}`);
        }
        
        if (!serviceData) {
          throw new Error("Service not found");
        }
        
        // Delete existing assignments and insert new ones in a transaction-like approach
        const { error: deleteError } = await supabase
          .from('staff_service_assignments')
          .delete()
          .eq('service_id', serviceId);
          
        if (deleteError) {
          console.error("Error deleting existing assignments:", deleteError);
          throw new Error(`Failed to delete existing assignments: ${deleteError.message}`);
        }
        
        // Skip insert if no staff is selected
        if (staffIds.length === 0) {
          console.log("No staff members to assign, skipping insert");
          return { message: "Staff assignments cleared", service: serviceData };
        }
        
        // Prepare batch assignments
        const assignments = staffIds.map(staffId => ({
          service_id: serviceId,
          staff_id: staffId // This is the business_staff.id
        }));
        
        console.log("Creating new assignments:", assignments);
        
        // Bulk insert assignments
        const { data, error } = await supabase
          .from('staff_service_assignments')
          .insert(assignments)
          .select();
          
        if (error) {
          console.error("Error inserting assignments:", error);
          // More detailed error reporting
          if (error.code === '42501') {
            throw new Error("Permission denied: You don't have access to assign staff to this service");
          } else if (error.code === '23503') {
            throw new Error("Staff or service not found. Please refresh and try again.");
          } else if (error.code === '23505') {
            throw new Error("Duplicate assignments detected. Please try again.");
          } else {
            throw new Error(`Failed to insert assignments: ${error.message}`);
          }
        }
        
        // Create notifications for assigned staff members - batch process these
        const businessId = serviceData.business_id;
        
        // Get business info (could be cached for performance)
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('business_name, display_name')
          .eq('id', businessId)
          .single();
          
        if (businessError) {
          console.error("Error fetching business data:", businessError);
          // Continue with assignment even if notification creation fails
        }
        
        const businessName = businessData?.business_name || businessData?.display_name || "Your business";
        
        // Prepare batch notifications
        const notifications = [];
        
        // Get all staff data in a single query instead of multiple queries
        if (staffIds.length > 0) {
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('id, staff_id')
            .in('id', staffIds);
            
          if (staffError) {
            console.error("Error fetching staff data:", staffError);
          } else if (staffData) {
            // Create notification objects for bulk insert
            notifications.push(...staffData.map(staff => ({
              user_id: staff.staff_id,
              title: "Service Assignment",
              content: `You have been assigned to the service "${serviceData.name}" by ${businessName}`,
              type: "service_assignment",
              related_entity_id: serviceId,
              related_entity_type: "service"
            })));
          }
        }
        
        // Bulk insert notifications if we have any
        if (notifications.length > 0) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert(notifications);
            
          if (notificationError) {
            console.error("Error creating notifications:", notificationError);
            // Continue since notification failure shouldn't fail the whole operation
          }
        }
        
        console.log("Staff assignment completed successfully");
        return { data, service: serviceData };
      } catch (error) {
        console.error("Error updating staff assignments:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate necessary queries
      queryClient.invalidateQueries({ 
        queryKey: ['staffServiceAssignments', variables.serviceId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['businessServices'] 
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
      
      // More informative success message
      toast({
        title: "Staff assignments updated",
        description: "The staff members have been notified of their assignment to this service.",
        variant: "success"
      });
    },
    onError: (error) => {
      console.error("Staff assignment mutation error:", error);
      toast({
        title: "Error updating assignments",
        description: error instanceof Error ? error.message : "Failed to update staff assignments",
        variant: "destructive"
      });
    }
  });

  const assignStaffToService = (serviceId: string, staffIds: string[]) => {
    console.log("Assigning staff to service:", { serviceId, staffIds });
    staffAssignmentMutation.mutate({ serviceId, staffIds });
  };

  return {
    assignStaffToService,
    staffAssignmentMutation
  };
};
