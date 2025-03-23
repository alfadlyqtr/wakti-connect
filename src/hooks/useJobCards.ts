
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, JobCardFormData } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useJobCards = (staffRelationId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job cards for a specific staff member or all if business
  const { data: jobCards, isLoading, error, refetch } = useQuery({
    queryKey: ['jobCards', staffRelationId],
    queryFn: async () => {
      let query = supabase
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
        `);
        
      if (staffRelationId) {
        query = query.eq('staff_relation_id', staffRelationId);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
        
      if (error) {
        toast({
          title: "Error fetching job cards",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as JobCard[];
    }
  });

  // Create a new job card
  const createJobCard = useMutation({
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

  // Update an existing job card
  const updateJobCard = useMutation({
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

  // Delete a job card
  const deleteJobCard = useMutation({
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

  return {
    jobCards,
    isLoading,
    error,
    refetch,
    createJobCard,
    updateJobCard,
    deleteJobCard
  };
};
