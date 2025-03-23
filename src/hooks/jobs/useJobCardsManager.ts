
import { useState, useEffect, useCallback } from "react";
import { useJobCards } from "@/hooks/jobs";
import { useToast } from "@/hooks/use-toast";
import { JobCard } from "@/types/jobs.types";

export const useJobCardsManager = (staffRelationId: string) => {
  const { toast } = useToast();
  const { 
    jobCards, 
    isLoading, 
    error: fetchError,
    refetch, 
    completeJobCard 
  } = useJobCards(staffRelationId);
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [completionError, setCompletionError] = useState<string | Error | null>(null);
  const [activeJobCards, setActiveJobCards] = useState<JobCard[]>([]);
  const [completedJobCards, setCompletedJobCards] = useState<JobCard[]>([]);
  
  // Function to separate job cards into active and completed
  const updateJobCardsState = useCallback((cards: JobCard[] | null) => {
    if (!cards) {
      setActiveJobCards([]);
      setCompletedJobCards([]);
      return;
    }
    
    setActiveJobCards(cards.filter(card => !card.end_time));
    setCompletedJobCards(cards.filter(card => card.end_time !== null));
  }, []);
  
  // Update job cards when data changes
  useEffect(() => {
    setCompletionError(null);
    updateJobCardsState(jobCards);
  }, [jobCards, updateJobCardsState]);
  
  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[useJobCardsManager] Completing job:", jobCardId);
    setCompletionError(null);
    
    try {
      // Simple mutation call without any complex state manipulation here
      await completeJobCard.mutateAsync(jobCardId);
      
      // After successful completion, refetch data to ensure we have the latest state
      await refetch();
    } catch (error) {
      console.error("[useJobCardsManager] Error completing job:", error);
      setCompletionError(error instanceof Error ? error : new Error("Failed to complete job"));
      
      // Refetch to ensure our state matches server
      await refetch();
    }
  };
  
  const handleRetry = async () => {
    setIsRetrying(true);
    setCompletionError(null);
    
    try {
      await refetch();
      
      toast({
        title: "Refresh successful",
        description: "Job cards have been refreshed",
        variant: "success"
      });
    } catch (err) {
      console.error("[useJobCardsManager] Error refreshing data:", err);
      
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh job cards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    jobCards,
    isLoading,
    fetchError,
    isRetrying,
    completionError,
    activeJobCards,
    completedJobCards,
    handleCompleteJob,
    handleRetry
  };
};
