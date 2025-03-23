
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";

export const useCompleteJobCardMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[useCompleteJobCardMutation] Completing job card:", id);
      
      // Get current timestamp for consistent use
      const now = new Date().toISOString();
      
      // Use the database function instead of direct update
      // This function includes proper row locking and validation
      const { data, error } = await supabase.rpc(
        'complete_job_card',
        {
          job_card_id: id,
          end_timestamp: now
        }
      );
      
      if (error) {
        console.error("[useCompleteJobCardMutation] Error completing job card:", error);
        throw new Error(`Failed to complete job card: ${error.message}`);
      }
      
      if (!data) {
        console.error("[useCompleteJobCardMutation] Job card not found or already completed");
        throw new Error("Job card not found or already completed");
      }
      
      console.log("[useCompleteJobCardMutation] Job card completed successfully:", data);
      
      // Fetch the updated job card to return
      const { data: jobCard, error: fetchError } = await supabase
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
        
      if (fetchError) {
        console.error("[useCompleteJobCardMutation] Error fetching updated job card:", fetchError);
        // Even if we can't fetch the updated card, the completion was successful
        // So we'll just return a minimal object with the id
        return { id } as JobCard;
      }
      
      return jobCard as JobCard;
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
