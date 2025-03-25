
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
        
        // Validate inputs to prevent issues
        if (!serviceId) {
          throw new Error("Service ID is required");
        }
        
        if (!Array.isArray(staffIds)) {
          throw new Error("Staff IDs must be an array");
        }
        
        // Get service details for notification
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
        
        // First, verify that the current user owns this service
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error("Authentication required");
        }
        
        if (serviceData.business_id !== session.session.user.id) {
          // Check if user is co-admin
          const { data: staffData } = await supabase
            .from('business_staff')
            .select('role, business_id')
            .eq('staff_id', session.session.user.id)
            .eq('status', 'active')
            .single();
            
          if (!staffData || staffData.role !== 'co-admin' || staffData.business_id !== serviceData.business_id) {
            throw new Error("You don't have permission to modify this service");
          }
        }
        
        // Delete existing assignments in a transaction - use explicit table references
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
        
        // Verify all staff members exist and belong to this business
        // FIXED: Using explicit table references to avoid ambiguity with staff_id
        const { data: validStaff, error: validationError } = await supabase
          .from('business_staff')
          .select('id')
          .in('id', staffIds)
          .eq('business_id', serviceData.business_id);
          
        if (validationError) {
          throw new Error(`Failed to validate staff members: ${validationError.message}`);
        }
        
        // Filter to only valid staff IDs that belong to this business
        const validStaffRelationIds = validStaff.map(s => s.id);
        
        if (validStaffRelationIds.length === 0) {
          throw new Error("No valid staff members found for assignment");
        }
        
        // Prepare batch assignments with only validated staff IDs
        // FIXED: Using explicit variable names to clarify what each ID represents
        const assignments = validStaffRelationIds.map(staffRelationId => ({
          service_id: serviceId,
          staff_id: staffRelationId // This is the business_staff.id, not auth.users.id
        }));
        
        console.log("Creating new assignments:", assignments);
        
        // FIXED: Use explicit column names in the insert to avoid ambiguity
        const { data, error } = await supabase
          .from('staff_service_assignments')
          .insert(assignments.map(a => ({
            service_id: a.service_id,
            staff_id: a.staff_id
          })))
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
        
        // Get all staff data in a single query with explicit column references
        if (validStaffRelationIds.length > 0) {
          // FIXED: Use better variable naming to distinguish between staff relation ID and actual user ID
          const { data: staffDataWithUserIds, error: staffError } = await supabase
            .from('business_staff')
            .select('id, staff_id') // id is relation ID, staff_id is the auth user ID
            .in('id', validStaffRelationIds);
            
          if (staffError) {
            console.error("Error fetching staff data:", staffError);
          } else if (staffDataWithUserIds) {
            // Create notification objects for bulk insert - notify the actual users (auth.users)
            const notifications = staffDataWithUserIds.map(staff => ({
              user_id: staff.staff_id, // This is the auth.users.id for notifications
              title: "Service Assignment",
              content: `You have been assigned to the service "${serviceData.name}" by ${businessName}`,
              type: "service_assignment",
              related_entity_id: serviceId,
              related_entity_type: "service"
            }));
            
            // Bulk insert notifications
            if (notifications.length > 0) {
              const { error: notificationError } = await supabase
                .from('notifications')
                .insert(notifications);
                
              if (notificationError) {
                console.error("Error creating notifications:", notificationError);
                // Continue since notification failure shouldn't fail the whole operation
              }
            }
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
        description: "The staff members have been successfully assigned to the service.",
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
