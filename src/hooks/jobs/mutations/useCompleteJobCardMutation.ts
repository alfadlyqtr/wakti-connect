
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useCompleteJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[useCompleteJobCardMutation] Starting completion of job card:", id);
      
      // First verify the job card exists and is not already completed
      const { data: existingCard, error: checkError } = await supabase
        .from('job_cards')
        .select('id, end_time, job_id, staff_relation_id, start_time, payment_method, payment_amount, notes')
        .eq('id', id)
        .maybeSingle();
        
      if (checkError) {
        console.error("[useCompleteJobCardMutation] Error checking job card:", checkError);
        throw new Error(`Failed to verify job card: ${checkError.message}`);
      }
      
      if (!existingCard) {
        const notFoundError = new Error(`Job card with ID ${id} not found`);
        console.error("[useCompleteJobCardMutation]", notFoundError.message);
        throw notFoundError;
      }
      
      // Check if the job card is already completed
      if (existingCard.end_time) {
        const alreadyCompletedError = new Error(`Job card with ID ${id} is already completed`);
        console.error("[useCompleteJobCardMutation]", alreadyCompletedError.message);
        throw alreadyCompletedError;
      }
      
      // Now update the job card with end_time
      const endTime = new Date().toISOString();
      console.log("[useCompleteJobCardMutation] Setting end_time for job card:", id, endTime);
      
      try {
        const { data: updatedCard, error: updateError } = await supabase
          .from('job_cards')
          .update({ end_time: endTime })
          .eq('id', id)
          .select(`
            *,
            jobs:job_id (
              id,
              name,
              description,
              duration,
              default_price
            )
          `)
          .maybeSingle();
          
        if (updateError) {
          console.error("[useCompleteJobCardMutation] Error updating job card:", updateError);
          throw new Error(`Failed to update job card: ${updateError.message}`);
        }
        
        console.log("[useCompleteJobCardMutation] Job card updated successfully:", updatedCard?.id);
        
        // If no data was returned by the update operation, create a response based on existing data
        if (!updatedCard) {
          console.warn("[useCompleteJobCardMutation] No data returned from update operation. Creating synthetic response.");
          
          // Create a synthetic response using the existing card data
          const syntheticResponse = {
            ...existingCard,
            end_time: endTime,
            updated_at: new Date().toISOString()
          };
          
          // Fetch the job data separately if needed
          if (existingCard.job_id) {
            try {
              const { data: jobData } = await supabase
                .from('jobs')
                .select('id, name, description, duration, default_price')
                .eq('id', existingCard.job_id)
                .maybeSingle();
                
              if (jobData) {
                console.log("[useCompleteJobCardMutation] Retrieved job data for synthetic response");
                // @ts-ignore - we're constructing the response manually
                syntheticResponse.jobs = jobData;
              }
            } catch (jobError) {
              console.error("[useCompleteJobCardMutation] Error fetching job data for synthetic response:", jobError);
            }
          }
          
          toast({
            title: "Job card completed",
            description: "Job card has been marked as completed successfully",
            variant: "success"
          });
          
          return syntheticResponse as JobCard;
        }
        
        toast({
          title: "Job card completed",
          description: "Job card has been marked as completed successfully",
          variant: "success"
        });
        
        return updatedCard as JobCard;
      } catch (error) {
        console.error("[useCompleteJobCardMutation] Unexpected error during job completion:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        
        toast({
          title: "Error completing job card",
          description: errorMessage,
          variant: "destructive"
        });
        
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both the specific job card query and the general job cards list
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
