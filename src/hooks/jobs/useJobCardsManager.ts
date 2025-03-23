
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
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [activeJobCards, setActiveJobCards] = useState<JobCard[]>([]);
  const [completedJobCards, setCompletedJobCards] = useState<JobCard[]>([]);
  
  // Function to separate job cards into active and completed
  const separateJobCards = useCallback((cards: JobCard[] | undefined) => {
    if (!cards || cards.length === 0) {
      setActiveJobCards([]);
      setCompletedJobCards([]);
      return;
    }
    
    // Active jobs are those without an end_time
    const active = cards.filter(card => card.end_time === null);
    // Completed jobs are those with an end_time
    const completed = cards.filter(card => card.end_time !== null);
    
    console.log("[useJobCardsManager] Separated job cards - Active:", active.length, "Completed:", completed.length);
    
    setActiveJobCards(active);
    setCompletedJobCards(completed);
  }, []);
  
  // Reset error state and separate job cards when data changes
  useEffect(() => {
    setCompletionError(null);
    separateJobCards(jobCards);
  }, [jobCards, separateJobCards, staffRelationId]);
  
  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[useJobCardsManager] Completing job:", jobCardId);
    setCompletionError(null);
    
    try {
      // Optimistically update UI - remove from active and don't wait for mutation
      setActiveJobCards(prev => prev.filter(job => job.id !== jobCardId));
      
      // The mutation will handle toast notifications internally
      await completeJobCard.mutateAsync(jobCardId);
      console.log("[useJobCardsManager] Job completed successfully:", jobCardId);
      
      // Force refetch to ensure we have the latest data
      await refetch();
    } catch (error) {
      console.error("[useJobCardsManager] Error completing job:", error);
      
      // Set a more user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to complete job. Please try again.";
      
      setCompletionError(errorMessage);
      
      // Force refetch to ensure we're in sync
      await refetch();
    }
  };
  
  const handleRetry = async () => {
    console.log("[useJobCardsManager] Retrying data fetch");
    setIsRetrying(true);
    setCompletionError(null);
    
    try {
      await refetch();
      console.log("[useJobCardsManager] Data refetched successfully");
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
