
import React, { useState, useEffect, useCallback } from "react";
import { JobCard } from "@/types/jobs.types";
import ActiveJobCard from "./ActiveJobCard";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
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

  // Don't render if no active jobs
  if (localJobs.length === 0) {
    return null;
  }

  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[ActiveJobsSection] Completing job:", jobCardId);
    
    // Clear any previous errors
    setError(null);
    
    // Mark as completing
    setCompletingJobId(jobCardId);
    
    try {
      // Immediately remove job from local state to prevent UI flicker
      setLocalJobs(prevJobs => prevJobs.filter(job => job.id !== jobCardId));
      
      // Attempt to complete the job
      await onCompleteJob(jobCardId);
      console.log("[ActiveJobsSection] Job completed successfully:", jobCardId);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("[ActiveJobsSection] Error completing job:", error);
      
      // Set the error message
      setError(error instanceof Error ? error.message : "Failed to complete job. Please try again.");
      
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

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Active Jobs</h3>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error completing job</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
