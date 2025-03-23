
import { useState, useEffect, useCallback } from "react";
import { JobCard } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useActiveJobs = (
  activeJobs: JobCard[],
  onCompleteJob: (jobCardId: string) => Promise<void>
) => {
  const { toast } = useToast();
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | Error | null>(null);
  const [localJobs, setLocalJobs] = useState<JobCard[]>([]);

  // Filter function to ensure only truly active jobs are shown
  const filterActiveJobs = useCallback((jobs: JobCard[]) => {
    return jobs.filter(job => !job.end_time);
  }, []);

  // Reset error and update local jobs when active jobs change
  useEffect(() => {
    setError(null);
    setLocalJobs(filterActiveJobs(activeJobs));
  }, [activeJobs, filterActiveJobs]);

  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[useActiveJobs] Completing job:", jobCardId);
    
    // Clear any previous errors
    setError(null);
    
    // Mark as completing
    setCompletingJobId(jobCardId);
    
    try {
      // Immediately remove job from local state to prevent UI flicker
      setLocalJobs(prevJobs => prevJobs.filter(job => job.id !== jobCardId));
      
      // Attempt to complete the job
      await onCompleteJob(jobCardId);
      console.log("[useActiveJobs] Job completed successfully:", jobCardId);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("[useActiveJobs] Error completing job:", error);
      
      // Set the error message or object
      setError(error);
      
      // Re-add the job to local state if completion failed
      const failedJob = activeJobs.find(job => job.id === jobCardId);
      if (failedJob && !failedJob.end_time) {
        setLocalJobs(prevJobs => [...prevJobs, failedJob]);
      }
      
      toast({
        title: "Error completing job",
        description: error instanceof Error ? error.message : "Failed to complete job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCompletingJobId(null);
    }
  };

  return {
    localJobs,
    completingJobId,
    error,
    handleCompleteJob,
    clearError: () => setError(null)
  };
};
