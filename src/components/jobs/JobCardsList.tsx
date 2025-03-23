
import React, { useState } from "react";
import { useJobCards } from "@/hooks/jobs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterPeriod } from "./jobCardUtils";
import EmptyJobCards from "./EmptyJobCards";
import ActiveJobsSection from "./ActiveJobsSection";
import CompletedJobsSection from "./CompletedJobsSection";
import ErrorDisplay from "./ErrorDisplay";

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
  
  const handleCompleteJob = async (jobCardId: string) => {
    console.log("Completing job in JobCardsList:", jobCardId);
    setCompletionError(null);
    
    try {
      await completeJobCard.mutateAsync(jobCardId);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
      });
    } catch (error) {
      console.error("Error completing job in JobCardsList:", error);
      
      // Set a more user-friendly error message
      setCompletionError(
        error instanceof Error 
          ? error.message 
          : "Failed to complete job. Please try again."
      );
      
      toast({
        title: "Error completing job card",
        description: error instanceof Error ? error.message : "Failed to complete job",
        variant: "destructive"
      });
      
      // Rethrow so the ActiveJobsSection can handle the error state
      throw error;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }
  
  if (fetchError) {
    return <ErrorDisplay error={fetchError instanceof Error ? fetchError.message : "Failed to load job cards"} />;
  }
  
  if (!jobCards || jobCards.length === 0) {
    return <EmptyJobCards />;
  }
  
  if (completionError) {
    return (
      <>
        <ErrorDisplay error={completionError} />
        <div className="mt-4">
          <button 
            className="text-primary hover:underline"
            onClick={() => {
              setCompletionError(null);
              refetch();
            }}
          >
            Retry loading job cards
          </button>
        </div>
      </>
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
    </div>
  );
};

export default JobCardsList;
