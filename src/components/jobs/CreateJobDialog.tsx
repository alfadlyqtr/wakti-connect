
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useJobs } from "@/hooks/useJobs";
import { jobFormSchema, JobFormValues } from "./JobFormSchema";
import { JobFormData } from "@/types/jobs.types";
import JobFormFields from "./JobFormFields";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateJobDialog: React.FC<CreateJobDialogProps> = ({ open, onOpenChange }) => {
  const { createJob } = useJobs();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: undefined,
      default_price: undefined
    }
  });
  
  const onSubmit = async (values: JobFormValues) => {
    try {
      // Make sure required fields are present
      const jobData: JobFormData = {
        name: values.name,
        description: values.description || "",
        duration: values.duration,
        default_price: values.default_price
      };
      
      await createJob.mutateAsync(jobData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Define a new job that staff can use to create job cards
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <JobFormFields form={form} />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createJob.isPending}
              >
                {createJob.isPending ? "Creating..." : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;
