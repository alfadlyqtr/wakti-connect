
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchJobs, createJob, updateJob, deleteJob } from '@/services/jobs';
import { JobFormData } from '@/types/job.types';
import { useJobCards } from './useJobCards';

export const useJobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  const { jobCards, isLoading: jobCardsLoading } = useJobCards();

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

  // Check if a job can be edited or deleted (no active job cards)
  const canModifyJob = (jobId: string) => {
    if (jobCardsLoading || !jobCards) return true; // Default to allow if still loading
    return !jobCards.some(card => card.job_id === jobId && !card.end_time);
  };

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
    mutationFn: async ({ id, data }: { id: string, data: Partial<JobFormData> }) => {
      if (!canModifyJob(id)) {
        throw new Error("Cannot update job with active job cards");
      }
      return updateJob(id, data);
    },
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
    mutationFn: async (id: string) => {
      if (!canModifyJob(id)) {
        throw new Error("Cannot delete job with active job cards");
      }
      return deleteJob(id);
    },
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
    isLoading: isLoading || jobCardsLoading,
    error,
    refetch,
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    deleteJob: deleteJobMutation
  };
};
