
import React, { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types/jobs.types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import CreateJobDialog from "@/components/jobs/CreateJobDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardJobs = () => {
  const { jobs, isLoading, deleteJob } = useJobs();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    // In a real implementation, we would open an edit dialog here
    console.log("Edit job:", job);
  };
  
  const handleDelete = (jobId: string) => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Jobs Management</h1>
          <p className="text-muted-foreground">
            Manage jobs that your staff can complete and create job cards for
          </p>
        </div>
        
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      <CreateJobDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
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
            <AlertDialogAction onClick={confirmDelete}>
              {deleteJob.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardJobs;
