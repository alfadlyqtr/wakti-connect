
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchJobCards, createJobCard, completeJobCard } from '@/services/jobs';
import { JobCardFormData } from '@/types/job.types';

export const useJobCards = (staffRelationId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  // Query to fetch job cards
  const { data: jobCards = [], isLoading, refetch } = useQuery({
    queryKey: ['jobCards', staffRelationId],
    queryFn: async () => {
      try {
        setError(null);
        return staffRelationId ? await fetchJobCards(staffRelationId) : [];
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch job cards');
        setError(error);
        toast({
          title: 'Error fetching job cards',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !!staffRelationId
  });

  // Separate active and completed job cards
  const activeJobCards = jobCards.filter(card => !card.end_time);
  const completedJobCards = jobCards.filter(card => card.end_time);

  // Mutation to create a job card
  const createJobCardMutation = useMutation({
    mutationFn: (data: JobCardFormData) => 
      staffRelationId ? createJobCard(staffRelationId, data) : Promise.reject('No staff relation ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards', staffRelationId] });
      toast({
        title: 'Job card created',
        description: 'The job card has been created successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating job card',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to complete a job card
  const completeJobCardMutation = useMutation({
    mutationFn: completeJobCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards', staffRelationId] });
      toast({
        title: 'Job completed',
        description: 'The job has been marked as completed.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error completing job',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    jobCards,
    activeJobCards,
    completedJobCards,
    isLoading,
    error,
    refetch,
    createJobCard: createJobCardMutation,
    completeJobCard: completeJobCardMutation
  };
};
