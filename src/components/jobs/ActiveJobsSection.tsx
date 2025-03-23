
import React, { useState } from "react";
import { JobCard } from "@/types/jobs.types";
import ActiveJobCard from "./ActiveJobCard";

interface ActiveJobsSectionProps {
  activeJobs: JobCard[];
  onCompleteJob: (jobCardId: string) => Promise<void>;
}

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ 
  activeJobs,
  onCompleteJob 
}) => {
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);

  if (activeJobs.length === 0) {
    return null;
  }

  // Filter out jobs that are locally marked as completed
  const visibleActiveJobs = activeJobs.filter(job => 
    !job.end_time && !localCompletedIds.includes(job.id)
  );

  if (visibleActiveJobs.length === 0) {
    return null;
  }

  const handleCompleteJob = async (jobCardId: string) => {
    setCompletingJobId(jobCardId);
    setLocalCompletedIds(prev => [...prev, jobCardId]);
    
    try {
      await onCompleteJob(jobCardId);
    } catch (error) {
      // If there's an error, remove from local completed list
      setLocalCompletedIds(prev => prev.filter(id => id !== jobCardId));
      console.error("Error completing job:", error);
    } finally {
      setCompletingJobId(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Active Jobs</h3>
      {visibleActiveJobs.map(jobCard => (
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
