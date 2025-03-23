
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
        .single();
        
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
        .single();
        
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
      const { data: updatedCard, error } = await supabase
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
        .single();
        
      if (error) {
        toast({
          title: "Error completing job card",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job card completed",
        description: "Job card has been marked as completed successfully",
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
