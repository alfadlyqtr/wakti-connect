import React, { useEffect } from "react";
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
import { jobCardFormSchema, JobCardFormValues } from "./JobCardFormSchema";
import { useJobs } from "@/hooks/useJobs";
import { useJobCards } from "@/hooks/useJobCards";
import { JobCardFormData } from "@/types/jobs.types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatUtils";

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
  const { jobs } = useJobs();
  const { createJobCard } = useJobCards(staffRelationId);
  
  const form = useForm<JobCardFormValues>({
    resolver: zodResolver(jobCardFormSchema),
    defaultValues: {
      job_id: "",
      payment_method: "none",
      payment_amount: 0,
      notes: ""
    }
  });
  
  // Watch job_id to set default price
  const selectedJobId = form.watch("job_id");
  
  useEffect(() => {
    if (selectedJobId && jobs) {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob?.default_price) {
        form.setValue("payment_amount", selectedJob.default_price);
      }
    }
  }, [selectedJobId, jobs, form]);
  
  const onSubmit = async (data: JobCardFormValues) => {
    try {
      const now = new Date().toISOString();
      
      // Make sure required fields are present
      const jobCardData: JobCardFormData = {
        job_id: data.job_id, // Ensure this is required and present
        payment_method: data.payment_method,
        payment_amount: data.payment_amount,
        start_time: data.start_time || now,
        end_time: data.end_time || now,
        notes: data.notes
      };
      
      await createJobCard.mutateAsync({
        ...jobCardData,
        staff_relation_id: staffRelationId
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create job card:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Job Card</DialogTitle>
          <DialogDescription>
            Record a completed job and payment details
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="job_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Job</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobs?.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          <span className="font-medium">{job.name}</span>
                          {job.default_price && (
                            <span className="ml-2 text-muted-foreground">
                              ({formatCurrency(job.default_price)})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS (Card/Digital)</SelectItem>
                      <SelectItem value="none">No Payment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this job..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                disabled={createJobCard.isPending}
              >
                {createJobCard.isPending ? "Creating..." : "Create Job Card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobCardDialog;
