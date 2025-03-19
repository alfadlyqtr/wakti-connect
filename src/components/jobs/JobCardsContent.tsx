
import React, { useState } from "react";
import JobCardsList from "@/components/jobs/JobCardsList";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import WorkHistory from "@/components/staff/WorkHistory";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import JobCardsNoAccess from "@/components/jobs/JobCardsNoAccess";
import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import { useToast } from "@/hooks/use-toast";

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
      <WorkStatusCard 
        activeWorkSession={activeWorkSession}
        onStartWorkDay={startWorkDay}
        onEndWorkDay={endWorkDay}
        onCreateJobCard={openCreateJobCard}
      />
      
      <div className="mt-6">
        <div className="space-y-6">
          {canCreateJobCards ? (
            <JobCardsList staffRelationId={staffRelationId} />
          ) : (
            <JobCardsNoAccess />
          )}
          
          {canTrackHours && (
            <div className="pt-6 border-t">
              <h3 className="font-medium text-lg mb-4">Work Session History</h3>
              <ActiveWorkSession session={activeWorkSession} />
              <div className="mt-4">
                <WorkHistory staffRelationId={staffRelationId} />
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
