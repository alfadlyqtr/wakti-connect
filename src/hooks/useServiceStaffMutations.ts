
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useServiceStaffMutations = () => {
  const queryClient = useQueryClient();
  
  // Mutation to assign staff members to a service
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
        
        // Get service details for notification
        const { data: serviceData, error: serviceError } = await supabase
          .from('business_services')
          .select('name, business_id')
          .eq('id', serviceId)
          .single();
          
        if (serviceError) {
          console.error("Error fetching service data:", serviceError);
          throw serviceError;
        }
        
        // First, remove existing assignments for this service
        const { error: deleteError } = await supabase
          .from('staff_service_assignments')
          .delete()
          .eq('service_id', serviceId);
          
        if (deleteError) {
          console.error("Error deleting existing assignments:", deleteError);
          throw deleteError;
        }
        
        if (staffIds.length === 0) {
          console.log("No staff members to assign, skipping insert");
          return { message: "Staff assignments cleared" };
        }
        
        // Create new assignments
        const assignments = staffIds.map(staffId => ({
          service_id: serviceId,
          staff_id: staffId
        }));
        
        console.log("Creating new assignments:", assignments);
        
        const { data, error } = await supabase
          .from('staff_service_assignments')
          .insert(assignments)
          .select();
          
        if (error) {
          console.error("Error inserting assignments:", error);
          throw error;
        }
        
        // Create notifications for assigned staff members
        const businessId = serviceData.business_id;
        
        // Get business information for the notification
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('business_name, display_name')
          .eq('id', businessId)
          .single();
          
        if (businessError) {
          console.error("Error fetching business data:", businessError);
          throw businessError;
        }
        
        const businessName = businessData.business_name || businessData.display_name;
        
        // Create notifications for each staff member
        for (const staffId of staffIds) {
          try {
            // Get staff relation
            const { data: staffData, error: staffError } = await supabase
              .from('business_staff')
              .select('staff_id')
              .eq('id', staffId)
              .single();
                
            if (staffError) {
              console.error("Error fetching staff relation:", staffError);
              continue; // Skip this staff member if error
            }
            
            // Create notification
            await supabase
              .from('notifications')
              .insert({
                user_id: staffData.staff_id,
                title: "Service Assignment",
                content: `You have been assigned to the service "${serviceData.name}" by ${businessName}`,
                type: "service_assignment",
                related_entity_id: serviceId,
                related_entity_type: "service"
              });
          } catch (err) {
            console.error("Error processing notification for staff:", staffId, err);
          }
        }
        
        console.log("Staff assignment completed successfully");
        return data;
      } catch (error) {
        console.error("Error updating staff assignments:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['staffServiceAssignments', variables.serviceId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['businessServices'] 
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
      toast({
        title: "Staff assignments updated",
        description: "The staff members have been notified of their assignment to this service.",
      });
    },
    onError: (error) => {
      console.error("Staff assignment mutation error:", error);
      toast({
        title: "Error",
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
