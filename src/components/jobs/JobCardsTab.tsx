
import React from "react";
import { useStaffRelationFetcher } from "./useStaffRelationFetcher";
import LoadingState from "./LoadingState";
import ErrorDisplay from "./ErrorDisplay";
import StaffNotFound from "./StaffNotFound";
import JobCardsContent from "./JobCardsContent";

const JobCardsTab = () => {
  const {
    staffRelationId,
    activeWorkSession,
    isLoading,
    error,
    fetchActiveWorkSession
  } = useStaffRelationFetcher();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  if (!staffRelationId) {
    return <StaffNotFound />;
  }
  
  return (
    <JobCardsContent 
      staffRelationId={staffRelationId}
      activeWorkSession={activeWorkSession}
      onSessionUpdate={() => {
        if (staffRelationId) {
          fetchActiveWorkSession(staffRelationId);
        }
      }}
    />
  );
};

export default JobCardsTab;
