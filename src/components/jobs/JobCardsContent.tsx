
import React, { useState } from "react";
import JobCardsList from "@/components/jobs/JobCardsList";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import WorkHistory from "@/components/staff/WorkHistory";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import JobCardsNoAccess from "@/components/jobs/JobCardsNoAccess";
import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface JobCardsContentProps {
  staffRelationId: string;
  activeWorkSession: any | null;
  canCreateJobCards: boolean;
  canTrackHours: boolean;
  startWorkDay: () => void;
  endWorkDay: () => void;
}

const JobCardsContent: React.FC<JobCardsContentProps> = ({
  staffRelationId,
  activeWorkSession,
  canCreateJobCards,
  canTrackHours,
  startWorkDay,
  endWorkDay,
}) => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Open job card creation dialog
  const openCreateJobCard = () => {
    if (!canCreateJobCards) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create job cards",
        variant: "destructive"
      });
      return;
    }
    
    if (!activeWorkSession) {
      toast({
        title: "Work Day Required",
        description: "You need to start your work day before creating job cards",
      });
      return;
    }
    
    setIsCreateOpen(true);
  };

  return (
    <>
      <ErrorBoundary fallback={
        <div className="p-6 border rounded-lg border-destructive/50 bg-destructive/10">
          <h3 className="text-lg font-semibold mb-2">Work Status Error</h3>
          <p className="text-muted-foreground mb-4">
            We encountered an error loading your work status information.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Refresh Page
          </button>
        </div>
      }>
        <WorkStatusCard 
          activeWorkSession={activeWorkSession}
          onStartWorkDay={startWorkDay}
          onEndWorkDay={endWorkDay}
          onCreateJobCard={openCreateJobCard}
        />
      </ErrorBoundary>
      
      <div className="mt-6">
        <div className="space-y-6">
          {canCreateJobCards ? (
            <ErrorBoundary fallback={
              <div className="p-6 border rounded-lg border-destructive/50 bg-destructive/10">
                <h3 className="text-lg font-semibold mb-2">Job Cards Error</h3>
                <p className="text-muted-foreground mb-4">
                  We encountered an error loading your job cards.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                >
                  Refresh Page
                </button>
              </div>
            }>
              <JobCardsList staffRelationId={staffRelationId} />
            </ErrorBoundary>
          ) : (
            <JobCardsNoAccess />
          )}
          
          {canTrackHours && (
            <div className="pt-6 border-t">
              <h3 className="font-medium text-lg mb-4">Work Session History</h3>
              <ErrorBoundary fallback={
                <div className="p-4 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
                  <p>Error loading active work session. Please refresh the page.</p>
                </div>
              }>
                <ActiveWorkSession session={activeWorkSession} />
              </ErrorBoundary>
              <div className="mt-4">
                <ErrorBoundary fallback={
                  <div className="p-4 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
                    <p>Error loading work history. Please refresh the page.</p>
                  </div>
                }>
                  <WorkHistory staffRelationId={staffRelationId} />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {canCreateJobCards && (
        <CreateJobCardDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          staffRelationId={staffRelationId}
        />
      )}
      
      {/* Hidden button for parent component to access */}
      <button
        id="create-job-card-button"
        className="hidden"
        onClick={openCreateJobCard}
        disabled={!activeWorkSession || !canCreateJobCards}
      />
    </>
  );
};

export default JobCardsContent;
