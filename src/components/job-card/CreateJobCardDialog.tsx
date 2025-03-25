
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

import { useJobCards } from '@/hooks/useJobCards';
import { fetchBusinessJobs } from '@/services/jobs';
import JobCardForm, { JobCardFormValues } from './JobCardForm';
import { LoadingState, ErrorAlert, InfoAlert } from './AlertMessage';

interface CreateJobCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffRelationId: string;
  isBusinessOwner?: boolean;
}

const CreateJobCardDialog: React.FC<CreateJobCardDialogProps> = ({ 
  open, 
  onOpenChange,
  staffRelationId,
  isBusinessOwner = false
}) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { createJobCard } = useJobCards(staffRelationId);
  
  // Load jobs when dialog is opened
  useEffect(() => {
    if (open) {
      const loadJobs = async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
          const data = await fetchBusinessJobs();
          setJobs(data);
        } catch (error) {
          console.error("Error loading jobs:", error);
          setLoadError(error instanceof Error ? error.message : "Failed to load jobs");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadJobs();
    }
  }, [open]);
  
  const handleSubmit = async (values: JobCardFormValues) => {
    try {
      await createJobCard.mutateAsync({
        job_id: values.job_id,
        payment_method: values.payment_method,
        payment_amount: values.payment_amount,
        notes: values.notes || null
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating job card:", error);
    }
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (loadError) {
      return (
        <ErrorAlert 
          title="Error loading jobs" 
          message={loadError}
          suggestion="Please make sure you have jobs created in the system."
        />
      );
    }
    
    if (jobs.length === 0) {
      return (
        <InfoAlert 
          title="No jobs found" 
          message="You need to create jobs first before creating a job card."
        />
      );
    }
    
    return (
      <JobCardForm 
        jobs={jobs}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createJobCard.isPending}
      />
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Job Card</DialogTitle>
          <DialogDescription>
            {isBusinessOwner 
              ? "Create a job card to record job completion" 
              : "Record a job and payment details"}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobCardDialog;
