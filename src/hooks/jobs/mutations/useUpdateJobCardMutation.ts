
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, JobCardFormData } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useUpdateJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<JobCardFormData> }) => {
      const { data: updatedCard, error } = await supabase
        .from('job_cards')
        .update(data)
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
        
      if (error) {
        toast({
          title: "Error updating job card",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job card updated",
        description: "Job card has been updated successfully",
      });
      
      return updatedCard as JobCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
