
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
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (checkError) {
          console.error("[useCompleteJobCardMutation] Error checking job card:", checkError);
          throw new Error(`Failed to verify job card: ${checkError.message}`);
        }
        
        if (!existingCard) {
          throw new Error(`Job card with ID ${id} not found`);
        }
        
        // Check if the job card is already completed
        if (existingCard.end_time) {
          console.log("[useCompleteJobCardMutation] Job already completed:", existingCard);
          return existingCard as JobCard;
        }
        
        // Set current time as end_time
        const now = new Date();
        
        // Simple direct update with current timestamp
        const { data: updatedCard, error: updateError } = await supabase
          .from('job_cards')
          .update({ 
            end_time: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', id)
          .select()
          .single();
          
        if (updateError) {
          console.error("[useCompleteJobCardMutation] Error completing job card:", updateError);
          throw new Error(`Failed to complete job card: ${updateError.message}`);
        }
        
        toast({
          title: "Job completed",
          description: "Job has been marked as completed successfully",
          variant: "success"
        });
        
        return updatedCard as JobCard;
      } catch (error) {
        console.error("[useCompleteJobCardMutation] Error during job completion:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
      
      // Refetch after a small delay to ensure DB changes are propagated
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['jobCards'] });
      }, 300);
    }
  });
};
