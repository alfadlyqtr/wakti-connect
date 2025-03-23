
import React from "react";
import { JobCard } from "@/types/jobs.types";
import ActiveJobCard from "./ActiveJobCard";
import { useActiveJobs } from "@/hooks/jobs/useActiveJobs";
import JobCompletionError from "./JobCompletionError";

interface ActiveJobsSectionProps {
  activeJobs: JobCard[];
  onCompleteJob: (jobCardId: string) => Promise<void>;
}

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ 
  activeJobs,
  onCompleteJob 
}) => {
  const {
    localJobs,
    completingJobId,
    error,
    handleCompleteJob
  } = useActiveJobs(activeJobs, onCompleteJob);

  // Don't render if no active jobs
  if (localJobs.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Active Jobs</h3>
      
      <JobCompletionError error={error} />
      
      {localJobs.map(jobCard => (
        <ActiveJobCard
          key={jobCard.id}
          jobCard={jobCard}
          onCompleteJob={handleCompleteJob}
          isCompleting={completingJobId === jobCard.id}
        />
      ))}
    </div>
  );
};

export default ActiveJobsSection;
