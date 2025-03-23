
import React, { useState } from "react";
import JobCardsList from "./JobCardsList";
import WorkSessionSection from "./WorkSessionSection";
import CreateJobCardDialog from "./CreateJobCardDialog";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import { useWorkSessionManager } from "./useWorkSessionManager";

interface JobCardsContentProps {
  staffRelationId: string;
  activeWorkSession: any | null;
  onSessionUpdate: () => void;
}

const JobCardsContent: React.FC<JobCardsContentProps> = ({ 
  staffRelationId, 
  activeWorkSession,
  onSessionUpdate
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const { startWorkDay, endWorkDay } = useWorkSessionManager(
    staffRelationId,
    activeWorkSession,
    onSessionUpdate
  );

  return (
    <>
      <WorkStatusCard 
        activeWorkSession={activeWorkSession}
        onStartWorkDay={startWorkDay}
        onEndWorkDay={endWorkDay}
        onCreateJobCard={() => setIsCreateOpen(true)}
      />
      
      <div className="mt-6">
        <div className="space-y-6">
          <JobCardsList staffRelationId={staffRelationId} />
          
          <WorkSessionSection 
            staffRelationId={staffRelationId}
            activeWorkSession={activeWorkSession}
          />
        </div>
      </div>
      
      <CreateJobCardDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        staffRelationId={staffRelationId}
      />
      
      {/* Hidden button for parent component to access */}
      <button
        id="create-job-card-button"
        className="hidden"
        onClick={() => setIsCreateOpen(true)}
        disabled={!activeWorkSession}
      />
    </>
  );
};

export default JobCardsContent;
