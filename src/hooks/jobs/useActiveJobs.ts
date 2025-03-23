
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

  // Update local jobs when activeJobs changes
  useEffect(() => {
    // Only consider jobs without an end_time as active
    const filteredJobs = activeJobs.filter(job => !job.end_time);
    setLocalJobs(filteredJobs);
    setError(null);
  }, [activeJobs]);

  const handleCompleteJob = async (jobCardId: string) => {
    // Clear previous errors
    setError(null);
    
    // Set the completing job ID
    setCompletingJobId(jobCardId);
    
    try {
      // Optimistically remove the job from local state
      setLocalJobs(prevJobs => prevJobs.filter(job => job.id !== jobCardId));
      
      // Call the provided completion handler
      await onCompleteJob(jobCardId);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("[useActiveJobs] Error completing job:", error);
      
      // Set error state
      setError(error instanceof Error ? error : new Error("Failed to complete job"));
      
      // Restore the job in local state if it still exists in activeJobs
      const jobToRestore = activeJobs.find(job => job.id === jobCardId);
      if (jobToRestore && !jobToRestore.end_time) {
        setLocalJobs(prevJobs => [...prevJobs, jobToRestore]);
      }
      
      toast({
        title: "Error completing job",
        description: error instanceof Error ? error.message : "Failed to complete job. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset the completing job ID
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
