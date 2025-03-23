
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { jobCardFormSchema, JobCardFormValues } from "./JobCardFormSchema";
import { useJobCards } from "@/hooks/jobs";
import { JobCardFormData } from "@/types/jobs.types";
import JobCardFormFields from "./JobCardFormFields";
import JobCardDialogControls from "./JobCardDialogControls";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getBusinessJobs } from "@/utils/staffUtils";

interface CreateJobCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffRelationId: string;
}

const CreateJobCardDialog: React.FC<CreateJobCardDialogProps> = ({ 
  open, 
  onOpenChange,
  staffRelationId 
}) => {
  const { toast } = useToast();
  const { createJobCard } = useJobCards(staffRelationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // Current date is fixed and cannot be changed
  const currentDate = new Date();
  
  const form = useForm<JobCardFormValues>({
    resolver: zodResolver(jobCardFormSchema),
    defaultValues: {
      job_id: "",
      payment_method: "cash", // Set default to cash instead of none
      payment_amount: 0,
      notes: ""
    }
  });
  
  // Fetch jobs when dialog opens
  useEffect(() => {
    if (open) {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log("Fetching jobs for staff relation ID:", staffRelationId);
          
          const jobsList = await getBusinessJobs();
          
          console.log("Fetched jobs:", jobsList.length);
          setJobs(jobsList);
        } catch (error) {
          console.error("Error in fetchJobs:", error);
          setError(error.message || "Could not load jobs");
          toast({
            title: "Error",
            description: "Could not load jobs: " + (error.message || "Unknown error"),
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchJobs();
    }
  }, [open, staffRelationId, toast]);
  
  const onSubmit = async (data: JobCardFormValues) => {
    try {
      // Use current time as start time for the job card
      const now = new Date();
      
      // Create job card data
      const jobCardData: JobCardFormData = {
        job_id: data.job_id,
        payment_method: data.payment_method,
        payment_amount: data.payment_amount,
        start_time: now.toISOString(),
        notes: data.notes
      };
      
      await createJobCard.mutateAsync({
        ...jobCardData,
        staff_relation_id: staffRelationId
      });
      
      form.reset({
        job_id: "",
        payment_method: "cash", // Reset to cash as default
        payment_amount: 0,
        notes: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create job card:", error);
      toast({
        title: "Error",
        description: "Failed to create job card" + (error instanceof Error ? `: ${error.message}` : ""),
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    form.reset({
      job_id: "",
      payment_method: "cash", // Reset to cash as default
      payment_amount: 0,
      notes: ""
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        form.reset({
          job_id: "",
          payment_method: "cash", // Reset to cash as default
          payment_amount: 0,
          notes: ""
        });
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Job Card</DialogTitle>
          <DialogDescription>
            Record a job and payment details for today
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading jobs</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <p className="text-sm">Please make sure you have jobs created in the system.</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : jobs.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No jobs found</AlertTitle>
            <AlertDescription>
              You need to create jobs first before creating a job card.
            </AlertDescription>
          </Alert>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <JobCardFormFields
                jobs={jobs}
                selectedDate={currentDate}
                readOnlyDate={true}
              />
              
              <JobCardDialogControls 
                onCancel={handleCancel}
                isSubmitting={createJobCard.isPending}
              />
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobCardDialog;
