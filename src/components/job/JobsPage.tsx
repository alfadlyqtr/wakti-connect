
import React, { useState, useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types/jobs.types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isJobInUse } from '@/utils/jobsUtils';
import { useToast } from '@/hooks/use-toast';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

const JobsPage: React.FC = () => {
  const { jobs, isLoading, error, deleteJob } = useJobs();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobsWithStatus, setJobsWithStatus] = useState<Array<Job & { isEditable?: boolean }>>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();
  
  // When jobs are loaded, check which ones can be edited/deleted
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
    // Find the job in our jobsWithStatus array to check editability
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
    // Find the job in our jobsWithStatus array to check editability
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
  
  const confirmDelete = async () => {
    if (selectedJob) {
      try {
        // Double-check job is not in use before deleting
        const inUse = await isJobInUse(selectedJob.id);
        if (inUse) {
          toast({
            title: "Cannot delete job",
            description: "This job is being used in a job card and cannot be deleted.",
            variant: "destructive"
          });
          setDeleteDialogOpen(false);
          setSelectedJob(null);
          return;
        }
        
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
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading jobs: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <CurrencyProvider>
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
        
        {isLoading || isCheckingStatus ? (
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
    </CurrencyProvider>
  );
};

export default JobsPage;
