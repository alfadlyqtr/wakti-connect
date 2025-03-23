
import React, { useState, useCallback } from "react";
import { JobCard } from "@/types/jobs.types";
import ActiveJobCard from "./ActiveJobCard";
import { useToast } from "@/hooks/use-toast";

interface ActiveJobsSectionProps {
  activeJobs: JobCard[];
  onCompleteJob: (jobCardId: string) => Promise<void>;
}

const ActiveJobsSection: React.FC<ActiveJobsSectionProps> = ({ 
  activeJobs,
  onCompleteJob 
}) => {
  const { toast } = useToast();
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);

  // No active jobs, don't render anything
  if (activeJobs.length === 0) {
    return null;
  }

  // Filter out jobs that are locally marked as completed or already have an end_time
  const visibleActiveJobs = activeJobs.filter(job => 
    !job.end_time && !localCompletedIds.includes(job.id)
  );

  // If all active jobs are now completed, don't render the section
  if (visibleActiveJobs.length === 0) {
    return null;
  }

  const handleCompleteJob = async (jobCardId: string) => {
    console.log("Completing job in ActiveJobsSection:", jobCardId);
    
    // Mark as completing and locally completed immediately for UI responsiveness
    setCompletingJobId(jobCardId);
    setLocalCompletedIds(prev => [...prev, jobCardId]);
    
    try {
      // Attempt to complete the job
      await onCompleteJob(jobCardId);
      console.log("Job completed successfully in ActiveJobsSection:", jobCardId);
    } catch (error) {
      // If there's an error, remove from local completed list
      console.error("Error completing job in ActiveJobsSection:", error);
      setLocalCompletedIds(prev => prev.filter(id => id !== jobCardId));
      
      toast({
        title: "Error completing job",
        description: error instanceof Error ? error.message : "Failed to complete job. Please try again.",
        variant: "destructive"
      });
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
