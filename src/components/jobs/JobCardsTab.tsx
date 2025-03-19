
import React from "react";
import { useStaffJobStatus } from "@/hooks/useStaffJobStatus";
import JobCardsLoading from "@/components/jobs/JobCardsLoading";
import StaffAccountRequired from "@/components/jobs/StaffAccountRequired";
import JobCardsContent from "@/components/jobs/JobCardsContent";

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
    <JobCardsContent 
      staffRelationId={staffRelationId}
      activeWorkSession={activeWorkSession}
      canCreateJobCards={canCreateJobCards}
      canTrackHours={canTrackHours}
      startWorkDay={startWorkDay}
      endWorkDay={endWorkDay}
    />
  );
};

export default JobCardsTab;
