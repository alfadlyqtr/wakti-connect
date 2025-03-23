
import React, { useState } from "react";
import { JobCard } from "@/types/jobs.types";
import ActiveJobCard from "./ActiveJobCard";
import { useCompleteJobCardMutation } from "@/hooks/jobs/mutations";

interface ActiveJobsSectionProps {
  activeJobs: JobCard[];
  onCompleteJob: (jobCardId: string) => Promise<void>;
}

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ 
  activeJobs,
  onCompleteJob 
}) => {
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);

  if (activeJobs.length === 0) {
    return null;
  }

  const handleCompleteJob = async (jobCardId: string) => {
    setCompletingJobId(jobCardId);
    try {
      await onCompleteJob(jobCardId);
    } finally {
      setCompletingJobId(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Active Jobs</h3>
      {activeJobs.map(jobCard => (
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
