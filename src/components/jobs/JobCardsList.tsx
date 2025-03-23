
import React from "react";
import { useJobCardsManager } from "@/hooks/jobs/useJobCardsManager";
import { FilterPeriod } from "./jobCardUtils";

// Importing smaller components
import JobCardsLoading from "./JobCardsLoading";
import JobCardsError from "./JobCardsError";
import EmptyJobCards from "./EmptyJobCards";
import ActiveJobsSection from "./ActiveJobsSection";
import CompletedJobsSection from "./CompletedJobsSection";
import JobsErrorBoundary from "./JobsErrorBoundary";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const [filterPeriod, setFilterPeriod] = React.useState<FilterPeriod>("all");
  
  const {
    isLoading,
    fetchError,
    isRetrying,
    completionError,
    activeJobCards,
    completedJobCards,
    handleCompleteJob,
    handleRetry
  } = useJobCardsManager(staffRelationId);
  
  // Handle loading state
  if (isLoading) {
    return <JobCardsLoading />;
  }
  
  // Handle fetch error state
  if (fetchError) {
    return (
      <JobCardsError 
        error={fetchError} 
        onRetry={handleRetry} 
        isRetrying={isRetrying} 
      />
    );
  }
  
  // Show empty state if there are no job cards at all
  if ((!activeJobCards || activeJobCards.length === 0) && 
      (!completedJobCards || completedJobCards.length === 0)) {
    return <EmptyJobCards />;
  }
  
  return (
    <JobsErrorBoundary onReset={handleRetry}>
      <div className="space-y-6">
        {completionError && (
          <JobCardsError 
            error={completionError} 
            onRetry={handleRetry} 
            isRetrying={isRetrying} 
          />
        )}
        
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
        
        {/* Manual refresh button has been moved to the JobCardsError component */}
      </div>
    </JobsErrorBoundary>
  );
};

export default JobCardsList;
