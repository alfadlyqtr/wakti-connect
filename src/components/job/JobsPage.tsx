import React, { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useJobCards } from '@/hooks/useJobCards';
import { Job } from '@/types/job.types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import JobCard from './JobCard';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import JobFormDialog from './JobFormDialog';
import { toast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const JobsPage: React.FC = () => {
  const { jobs, isLoading, error, deleteJob } = useJobs();
  const { jobCards } = useJobCards();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const jobHasActiveCards = (jobId: string) => {
    return jobCards.some(card => card.job_id === jobId && !card.end_time);
  };
  
  const handleEdit = (job: Job) => {
    if (jobHasActiveCards(job.id)) {
      toast({
        title: "Cannot edit job",
        description: "This job has active job cards. Complete them before editing.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedJob(job);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (jobId: string) => {
    if (jobHasActiveCards(jobId)) {
      toast({
        title: "Cannot delete job",
        description: "This job has active job cards. Complete them before deleting.",
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
  
  const confirmDelete = async () => {
    if (selectedJob) {
      try {
        await deleteJob.mutateAsync(selectedJob.id);
      } catch (error) {
        console.error("Failed to delete job:", error);
      } finally {
        setDeleteDialogOpen(false);
        setSelectedJob(null);
      }
    }
  };
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 mb-4">
        <div className="text-sm font-medium text-destructive">
          Error loading jobs: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Jobs Management</h1>
            <p className="text-muted-foreground">
              Manage jobs that you or your staff can complete
            </p>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center p-8 border rounded-lg border-dashed">
            <h3 className="text-lg font-medium mb-2">No jobs created yet</h3>
            <p className="text-muted-foreground mb-4">Create your first job to get started</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs?.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onEdit={() => handleEdit(job)}
                onDelete={() => handleDelete(job.id)}
                hasActiveCards={jobHasActiveCards(job.id)}
              />
            ))}
          </div>
        )}
        
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
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the job "{selectedJob?.name}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                {deleteJob.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default JobsPage;
