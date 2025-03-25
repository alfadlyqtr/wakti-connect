
import React, { useState, useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Job } from '@/types/jobs.types';
import { isJobInUse } from '@/utils/jobsUtils';
import { useToast } from '@/hooks/use-toast';
import JobCard from './JobCard';
import JobFormDialog from './JobFormDialog';
import DeleteJobDialog from './DeleteJobDialog';

const JobsTabContent: React.FC = () => {
  const { jobs, isLoading, error, deleteJob } = useJobs();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobsWithStatus, setJobsWithStatus] = useState<Array<Job & { isEditable?: boolean }>>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkEditableStatus = async () => {
      if (!jobs?.length) return;
      
      setIsCheckingStatus(true);
      const jobsWithEditStatus = await Promise.all(
        jobs.map(async (job) => {
          const inUse = await isJobInUse(job.id);
          return {
            ...job,
            isEditable: !inUse
          };
        })
      );
      
      setJobsWithStatus(jobsWithEditStatus);
      setIsCheckingStatus(false);
    };
    
    checkEditableStatus();
  }, [jobs]);
  
  const handleEdit = (job: Job) => {
    const jobWithStatus = jobsWithStatus.find(j => j.id === job.id);
    
    if (jobWithStatus && !jobWithStatus.isEditable) {
      toast({
        title: "Cannot edit job",
        description: "This job is currently being used in an active job card and cannot be edited.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedJob(job);
    setEditDialogOpen(true);
  };
  
  const handleDelete = async (jobId: string) => {
    const jobWithStatus = jobsWithStatus.find(j => j.id === jobId);
    
    if (jobWithStatus && !jobWithStatus.isEditable) {
      toast({
        title: "Cannot delete job",
        description: "This job is currently being used in an active job card and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    const job = jobs?.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setDeleteDialogOpen(true);
    }
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading jobs: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading || isCheckingStatus) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }
  
  if (jobs?.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg border-dashed">
        <h3 className="text-lg font-medium mb-2">No jobs created yet</h3>
        <p className="text-muted-foreground mb-4">Create your first job to get started</p>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobsWithStatus.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onEdit={() => handleEdit(job)}
            onDelete={() => handleDelete(job.id)}
            isEditable={job.isEditable}
          />
        ))}
      </div>
      
      <JobFormDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        mode="create"
      />
      
      <JobFormDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        mode="edit"
        job={selectedJob}
      />
      
      <DeleteJobDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        job={selectedJob}
        onConfirmDelete={() => deleteJob.mutateAsync(selectedJob?.id || '')}
        isDeleting={deleteJob.isPending}
      />
    </>
  );
};

export default JobsTabContent;
