
import React from "react";
import { useStaffJobStatus } from "@/hooks/useStaffJobStatus";
import JobCardsLoading from "@/components/jobs/JobCardsLoading";
import StaffAccountRequired from "@/components/jobs/StaffAccountRequired";
import JobCardsContent from "@/components/jobs/JobCardsContent";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const JobCardsTab = () => {
  const {
    staffRelationId,
    activeWorkSession,
    canCreateJobCards,
    canTrackHours,
    permissionsLoading,
    startWorkDay,
    endWorkDay,
  } = useStaffJobStatus();
  
  if (permissionsLoading) {
    return <JobCardsLoading />;
  }
  
  if (!staffRelationId) {
    return <StaffAccountRequired />;
  }
  
  return (
    <ErrorBoundary fallback={
      <div className="p-6 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">
          We encountered an error loading your job cards. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Refresh Page
        </button>
      </div>
    }>
      <JobCardsContent 
        staffRelationId={staffRelationId}
        activeWorkSession={activeWorkSession}
        canCreateJobCards={canCreateJobCards}
        canTrackHours={canTrackHours}
        startWorkDay={startWorkDay}
        endWorkDay={endWorkDay}
      />
    </ErrorBoundary>
  );
};

export default JobCardsTab;
