
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchJobs, createJob, updateJob, deleteJob } from '@/services/jobService';
import { JobFormData } from '@/types/job.types';

export const useJobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  // Query to fetch all jobs
  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      try {
        setError(null);
        return await fetchJobs();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch jobs');
        setError(error);
        toast({
          title: 'Error fetching jobs',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Mutation to create a job
  const createJobMutation = useMutation({
    mutationFn: (data: JobFormData) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job created',
        description: 'The job has been created successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating job',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to update a job
  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<JobFormData> }) => 
      updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job updated',
        description: 'The job has been updated successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating job',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to delete a job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Job deleted',
        description: 'The job has been deleted successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting job',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    jobs,
    isLoading,
    error,
    refetch,
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    deleteJob: deleteJobMutation
  };
};
