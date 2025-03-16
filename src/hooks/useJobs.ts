
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobFormData } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useJobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch jobs owned by the business
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error fetching jobs",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Job[];
    }
  });

  // Create a new job
  const createJob = useMutation({
    mutationFn: async (jobData: JobFormData) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error creating job",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job created",
        description: "New job has been created successfully",
      });
      
      return data as Job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // Update an existing job
  const updateJob = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<JobFormData> }) => {
      const { data: updatedJob, error } = await supabase
        .from('jobs')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error updating job",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job updated",
        description: "Job has been updated successfully",
      });
      
      return updatedJob as Job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // Delete a job
  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Error deleting job",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Job deleted",
        description: "Job has been deleted successfully",
      });
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  return {
    jobs,
    isLoading,
    error,
    createJob,
    updateJob,
    deleteJob
  };
};
