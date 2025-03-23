
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, JobCardFormData } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useCreateJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: JobCardFormData & { staff_relation_id: string }) => {
      const { data: jobCard, error } = await supabase
        .from('job_cards')
        .insert([data])
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
          title: "Error creating job card",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job card created",
        description: "New job card has been created successfully",
      });
      
      return jobCard as JobCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
