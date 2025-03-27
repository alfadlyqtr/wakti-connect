
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
        const result = await fetchStaffRelation();
        console.log("Staff relation query result:", result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch staff relation');
        console.error("Error fetching staff relation:", error);
        setError(error);
        return null;
      }
    }
  });

  // Set staff relation ID when data is loaded
  useEffect(() => {
    if (staffRelation) {
      console.log("Setting staff relation ID:", staffRelation.id);
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
        if (!staffRelationId) {
          console.log("No staff relation ID available for active work session query");
          return null;
        }
        console.log("Fetching active work session for staff ID:", staffRelationId);
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
      if (!staffRelationId) {
        console.error("Cannot start work session: No staff relation ID");
        return Promise.reject('No staff relation ID');
      }
      console.log("Starting work session for staff ID:", staffRelationId);
      return startWorkSession(staffRelationId);
    },
    onSuccess: () => {
      console.log("Work session started successfully");
      queryClient.invalidateQueries({ queryKey: ['activeWorkSession', staffRelationId] });
      toast({
        title: 'Work session started',
        description: 'Your work session has been started successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      console.error("Error starting work session:", error);
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
      if (!activeWorkSession) {
        console.error("Cannot end work session: No active work session");
        return Promise.reject('No active work session');
      }
      console.log("Ending work session:", activeWorkSession.id);
      return endWorkSession(activeWorkSession.id);
    },
    onSuccess: () => {
      console.log("Work session ended successfully");
      queryClient.invalidateQueries({ queryKey: ['activeWorkSession', staffRelationId] });
      toast({
        title: 'Work session ended',
        description: 'Your work session has been ended successfully.',
        variant: 'success'
      });
    },
    onError: (error: Error) => {
      console.error("Error ending work session:", error);
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
