
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchStaffRelation, 
  fetchActiveWorkSession, 
  startWorkSession, 
  endWorkSession 
} from '@/services/jobs/workHistoryApi';

export const useStaffStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Query to check staff status
  const { 
    data: staffRelation, 
    isLoading: isLoadingStaffRelation, 
    error: staffError 
  } = useQuery({
    queryKey: ['staffRelation'],
    queryFn: async () => {
      try {
        setError(null);
        return await fetchStaffRelation();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch staff relation');
        setError(error);
        return null;
      }
    }
  });

  // Set staff relation ID when data is loaded
  useEffect(() => {
    if (staffRelation) {
      setStaffRelationId(staffRelation.id);
    }
  }, [staffRelation]);

  // Query to fetch active work session
  const { 
    data: activeWorkSession, 
    isLoading: isLoadingSession,
    refetch: refetchSession 
  } = useQuery({
    queryKey: ['activeWorkSession', staffRelationId],
    queryFn: async () => {
      try {
        if (!staffRelationId) return null;
        return await fetchActiveWorkSession(staffRelationId);
      } catch (err) {
        console.error('Error fetching active session:', err);
        return null;
      }
    },
    enabled: !!staffRelationId
  });

  // Mutation to start work session
  const startSessionMutation = useMutation({
    mutationFn: () => {
      if (!staffRelationId) return Promise.reject('No staff relation ID');
      return startWorkSession(staffRelationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkSession', staffRelationId] });
      toast({
        title: 'Work session started',
        description: 'Your work session has been started successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error starting work session',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to end work session
  const endSessionMutation = useMutation({
    mutationFn: () => {
      if (!activeWorkSession) return Promise.reject('No active work session');
      return endWorkSession(activeWorkSession.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeWorkSession', staffRelationId] });
      toast({
        title: 'Work session ended',
        description: 'Your work session has been ended successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error ending work session',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    isStaff: !!staffRelation,
    staffRelationId,
    activeWorkSession,
    isLoading: isLoadingStaffRelation || isLoadingSession,
    error: error || staffError,
    refetchSession,
    startWorkSession: startSessionMutation.mutate,
    endWorkSession: endSessionMutation.mutate,
    isStartingSession: startSessionMutation.isPending,
    isEndingSession: endSessionMutation.isPending
  };
};
