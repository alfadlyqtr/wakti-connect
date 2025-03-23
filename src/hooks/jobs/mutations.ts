
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

export const useCompleteJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Completing job card with ID:", id);
      
      // First verify the job card exists and is not already completed
      const { data: existingCard, error: checkError } = await supabase
        .from('job_cards')
        .select('id, end_time')
        .eq('id', id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking job card:", checkError);
        toast({
          title: "Error completing job card",
          description: checkError.message,
          variant: "destructive"
        });
        throw checkError;
      }
      
      if (!existingCard) {
        const notFoundError = new Error(`Job card with ID ${id} not found`);
        console.error(notFoundError);
        toast({
          title: "Error completing job card",
          description: "Job card not found",
          variant: "destructive"
        });
        throw notFoundError;
      }
      
      // Check if the job card is already completed
      if (existingCard.end_time) {
        const alreadyCompletedError = new Error(`Job card with ID ${id} is already completed`);
        console.error(alreadyCompletedError);
        toast({
          title: "Error completing job card",
          description: "This job card is already completed",
          variant: "destructive"
        });
        throw alreadyCompletedError;
      }
      
      // Now update the job card with end_time
      const { data: updatedCard, error: updateError } = await supabase
        .from('job_cards')
        .update({ end_time: new Date().toISOString() })
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
        console.error("Error updating job card:", updateError);
        toast({
          title: "Error completing job card",
          description: updateError.message,
          variant: "destructive"
        });
        throw updateError;
      }
      
      // We're using maybeSingle() so we need to verify that data was actually returned
      if (!updatedCard) {
        const updateFailedError = new Error("Job completion failed: No data returned from update operation");
        console.error(updateFailedError);
        toast({
          title: "Error completing job card",
          description: "Job completion failed: No data returned",
          variant: "destructive"
        });
        throw updateFailedError;
      }
      
      console.log("Job card completed successfully:", updatedCard.id);
      toast({
        title: "Job card completed",
        description: "Job card has been marked as completed successfully",
        variant: "success"
      });
      
      return updatedCard as JobCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};

export const useDeleteJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_cards')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Error deleting job card",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job card deleted",
        description: "Job card has been deleted successfully",
      });
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
