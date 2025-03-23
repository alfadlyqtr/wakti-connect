
import React, { useState, useEffect } from "react";
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
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Reset error if active jobs change
  useEffect(() => {
    setError(null);
  }, [activeJobs]);

  // Filter out jobs that are locally marked as completed or already have an end_time
  const visibleActiveJobs = activeJobs.filter(job => 
    !job.end_time && !localCompletedIds.includes(job.id)
  );

  // If all active jobs are now completed, don't render the section
  if (visibleActiveJobs.length === 0) {
    return null;
  }

  const handleCompleteJob = async (jobCardId: string) => {
    console.log("[ActiveJobsSection] Completing job:", jobCardId);
    
    // Clear any previous errors
    setError(null);
    
    // Mark as completing and locally completed immediately for UI responsiveness
    setCompletingJobId(jobCardId);
    
    try {
      // Attempt to complete the job
      await onCompleteJob(jobCardId);
      console.log("[ActiveJobsSection] Job completed successfully:", jobCardId);
      
      // Add to local completed IDs after successful completion
      setLocalCompletedIds(prev => [...prev, jobCardId]);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
        variant: "success"
      });
    } catch (error) {
      // If there's an error, don't add to local completed list
      console.error("[ActiveJobsSection] Error completing job:", error);
      
      // Set the error message
      setError(error instanceof Error ? error.message : "Failed to complete job. Please try again.");
      
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
