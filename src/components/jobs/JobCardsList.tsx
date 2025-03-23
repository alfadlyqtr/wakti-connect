
import React, { useState, useEffect, useCallback } from "react";
import { useJobCards } from "@/hooks/jobs";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterPeriod } from "./jobCardUtils";
import EmptyJobCards from "./EmptyJobCards";
import ActiveJobsSection from "./ActiveJobsSection";
import CompletedJobsSection from "./CompletedJobsSection";
import ErrorDisplay from "./ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { JobCard } from "@/types/jobs.types";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { toast } = useToast();
  const { 
    jobCards, 
    isLoading, 
    error: fetchError,
    refetch, 
    completeJobCard 
  } = useJobCards(staffRelationId);
  
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeJobCards, setActiveJobCards] = useState<JobCard[]>([]);
  const [completedJobCards, setCompletedJobCards] = useState<JobCard[]>([]);
  
  // Function to separate job cards into active and completed
  const separateJobCards = useCallback((cards: JobCard[] | undefined) => {
    if (!cards || cards.length === 0) {
      setActiveJobCards([]);
      setCompletedJobCards([]);
      return;
    }
    
    // Strict separation - a job card is either active or completed based on end_time
    const active = cards.filter(card => card.end_time === null);
    const completed = cards.filter(card => card.end_time !== null);
    
    console.log("[JobCardsList] Separated job cards - Active:", active.length, "Completed:", completed.length);
    
    setActiveJobCards(active);
    setCompletedJobCards(completed);
  }, []);
  
  // Reset error state and separate job cards when data changes
  useEffect(() => {
    setCompletionError(null);
    separateJobCards(jobCards);
  }, [jobCards, separateJobCards, staffRelationId]);
  
  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[JobCardsList] Completing job:", jobCardId);
    setCompletionError(null);
    
    try {
      // Optimistically update UI - remove from active and don't wait for mutation
      setActiveJobCards(prev => prev.filter(job => job.id !== jobCardId));
      
      // The mutation will handle toast notifications internally
      await completeJobCard.mutateAsync(jobCardId);
      console.log("[JobCardsList] Job completed successfully:", jobCardId);
      
      // Force refetch to ensure we have the latest data
      await refetch();
    } catch (error) {
      console.error("[JobCardsList] Error completing job:", error);
      
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
    console.log("[JobCardsList] Retrying data fetch");
    setIsRetrying(true);
    setCompletionError(null);
    
    try {
      await refetch();
      console.log("[JobCardsList] Data refetched successfully");
      toast({
        title: "Refresh successful",
        description: "Job cards have been refreshed",
        variant: "success"
      });
    } catch (err) {
      console.error("[JobCardsList] Error refreshing data:", err);
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh job cards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading job cards...</span>
      </div>
    );
  }
  
  if (fetchError) {
    return (
      <div className="space-y-4">
        <ErrorDisplay error={fetchError instanceof Error ? fetchError.message : "Failed to load job cards"} />
        <div className="flex justify-center">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isRetrying ? "Refreshing..." : "Retry loading job cards"}
          </Button>
        </div>
      </div>
    );
  }
  
  if (completionError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Error completing job card</AlertTitle>
          <AlertDescription>{completionError}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isRetrying ? "Refreshing..." : "Retry loading job cards"}
          </Button>
        </div>
      </div>
    );
  }
  
  // Show empty state if there are no job cards at all
  if ((!activeJobCards || activeJobCards.length === 0) && 
      (!completedJobCards || completedJobCards.length === 0)) {
    return <EmptyJobCards />;
  }
  
  return (
    <div className="space-y-6">
      {activeJobCards.length > 0 && (
        <ActiveJobsSection 
          activeJobs={activeJobCards}
          onCompleteJob={handleCompleteJob}
        />
      )}
      
      {completedJobCards.length > 0 && (
        <CompletedJobsSection 
          completedJobs={completedJobCards}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
        />
      )}
      
      {/* Manual refresh button for easier recovery */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-2"
        >
          {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isRetrying ? "Refreshing..." : "Reload Job Cards"}
        </Button>
      </div>
    </div>
  );
};

export default JobCardsList;
