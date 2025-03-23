
import React, { useState, useEffect } from "react";
import { useJobCards } from "@/hooks/jobs";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterPeriod } from "./jobCardUtils";
import EmptyJobCards from "./EmptyJobCards";
import ActiveJobsSection from "./ActiveJobsSection";
import CompletedJobsSection from "./CompletedJobsSection";
import ErrorDisplay from "./ErrorDisplay";
import { Button } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Reset error state when staff relation changes or refetch happens
  useEffect(() => {
    setCompletionError(null);
  }, [staffRelationId, jobCards]);
  
  const handleCompleteJob = async (jobCardId: string) => {
    console.log("Completing job in JobCardsList:", jobCardId);
    setCompletionError(null);
    
    try {
      // The mutation will handle toast notifications internally
      await completeJobCard.mutateAsync(jobCardId);
    } catch (error) {
      console.error("Error completing job in JobCardsList:", error);
      
      // Set a more user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to complete job. Please try again.";
      
      setCompletionError(errorMessage);
      
      // Rethrow so the ActiveJobsSection can handle the error state
      throw error;
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
  
  if (!jobCards || jobCards.length === 0) {
    return <EmptyJobCards />;
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
  
  // Separate active and completed job cards
  const activeJobCards = jobCards.filter(card => !card.end_time) || [];
  const completedJobCards = jobCards.filter(card => card.end_time) || [];
  
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
      
      {/* Show empty state if there are no job cards */}
      {activeJobCards.length === 0 && completedJobCards.length === 0 && (
        <EmptyJobCards />
      )}
    </div>
  );
};

export default JobCardsList;
