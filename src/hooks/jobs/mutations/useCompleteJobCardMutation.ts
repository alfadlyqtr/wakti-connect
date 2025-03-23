
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
      
      // Simple direct update with current timestamp
      const { data, error } = await supabase
        .from('job_cards')
        .update({ 
          end_time: now,
          updated_at: now
        })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) {
        console.error("[useCompleteJobCardMutation] Error completing job card:", error);
        throw new Error(`Failed to complete job card: ${error.message}`);
      }
      
      console.log("[useCompleteJobCardMutation] Job card completed successfully:", data);
      return data as JobCard;
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
