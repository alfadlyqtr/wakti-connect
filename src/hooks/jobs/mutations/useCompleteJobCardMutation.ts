
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
        // Use a transaction to ensure the update is atomic
        const { data: updatedCard, error: updateError } = await supabase
          .from('job_cards')
          .update({ 
            end_time: endTime,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id)
          // Only update if end_time is currently null to prevent race conditions
          .is('end_time', null)
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
        
        if (!updatedCard) {
          console.warn("[useCompleteJobCardMutation] No rows updated. Job may already be completed or doesn't exist.");
          
          // Explicitly fetch the record to see its current state
          const { data: currentCard } = await supabase
            .from('job_cards')
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
            .eq('id', id)
            .maybeSingle();
            
          if (currentCard && currentCard.end_time) {
            console.log("[useCompleteJobCardMutation] Job already completed:", currentCard);
            
            // Success toast with different message
            toast({
              title: "Job already completed",
              description: "This job has already been marked as completed",
              variant: "default"
            });
            
            return currentCard as JobCard;
          }
          
          throw new Error("Failed to update job card. No changes were made.");
        }
        
        console.log("[useCompleteJobCardMutation] Job card updated successfully:", updatedCard?.id);
        
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
      // Use broader invalidation to ensure all related queries are updated
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
      // Also invalidate any potential specific job card queries
      queryClient.invalidateQueries({ queryKey: ['jobCard'] });
    }
  });
};
