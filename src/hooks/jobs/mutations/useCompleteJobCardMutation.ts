
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
      
      try {
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
          console.log("[useCompleteJobCardMutation] Job already completed:", existingCard);
          
          // Success toast for already completed job
          toast({
            title: "Job already completed",
            description: "This job has already been marked as completed",
            variant: "default"
          });
          
          return existingCard as JobCard;
        }
        
        // Now update the job card with end_time - using direct SQL for stronger guarantees
        const endTime = new Date().toISOString();
        console.log("[useCompleteJobCardMutation] Setting end_time for job card:", id, endTime);
        
        // Force refresh the job card first to ensure we have the latest state
        await queryClient.invalidateQueries({ queryKey: ['jobCards'] });
        
        // Instead of using RPC, we'll use a direct update since the function isn't in the TypeScript types
        const { data: updatedResult, error: updateError } = await supabase
          .from('job_cards')
          .update({ 
            end_time: endTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('end_time', null) // Only update if end_time is null (not already completed)
          .select();
          
        if (updateError) {
          console.error("[useCompleteJobCardMutation] Error completing job card:", updateError);
          throw new Error(`Failed to complete job card: ${updateError.message}`);
        }
        
        if (!updatedResult || updatedResult.length === 0) {
          console.error("[useCompleteJobCardMutation] No rows updated");
          throw new Error("Failed to update job card. It may have been completed by another session.");
        }
        
        console.log("[useCompleteJobCardMutation] Job card updated successfully:", id);
        
        // Get the updated job card data
        const { data: refreshedCard, error: refreshError } = await supabase
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
          
        if (refreshError) {
          console.warn("[useCompleteJobCardMutation] Error fetching updated job card:", refreshError);
        }
        
        const finalCard = refreshedCard || { 
          ...existingCard, 
          end_time: endTime,
          updated_at: new Date().toISOString()
        };
        
        toast({
          title: "Job completed",
          description: "Job has been marked as completed successfully",
          variant: "success"
        });
        
        return finalCard as JobCard;
      } catch (error) {
        console.error("[useCompleteJobCardMutation] Error during job completion:", error);
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
      // Invalidate all job-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
      queryClient.invalidateQueries({ queryKey: ['jobCard'] });
      
      // Add small delay before refetching to ensure DB changes are propagated
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['jobCards'] });
      }, 500);
    },
    onError: (error) => {
      console.error("[useCompleteJobCardMutation] Error in mutation:", error);
      // Force refetch to ensure UI is in sync with actual DB state
      queryClient.refetchQueries({ queryKey: ['jobCards'] });
    }
  });
};
