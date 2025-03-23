
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJobCards } from '@/hooks/useJobCards';
import { fetchBusinessJobs } from '@/services/jobService';
import { formatCurrency } from '@/utils/formatUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const jobCardSchema = z.object({
  job_id: z.string().min(1, "Job selection is required"),
  payment_method: z.enum(["cash", "pos", "none"], {
    required_error: "Payment method is required"
  }),
  payment_amount: z.coerce.number().min(0),
  notes: z.string().optional()
});

type JobCardFormValues = z.infer<typeof jobCardSchema>;

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
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { createJobCard } = useJobCards(staffRelationId);
  
  const form = useForm<JobCardFormValues>({
    resolver: zodResolver(jobCardSchema),
    defaultValues: {
      job_id: "",
      payment_method: "cash",
      payment_amount: 0,
      notes: ""
    }
  });
  
  // Get selected job ID
  const selectedJobId = form.watch('job_id');
  
  // Update payment amount when job is selected
  useEffect(() => {
    if (selectedJobId) {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob?.default_price) {
        form.setValue('payment_amount', selectedJob.default_price);
      }
    }
  }, [selectedJobId, jobs, form]);
  
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
  
  const onSubmit = async (values: JobCardFormValues) => {
    try {
      await createJobCard.mutateAsync(values);
      form.reset({
        job_id: "",
        payment_method: "cash",
        payment_amount: 0,
        notes: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating job card:", error);
    }
  };
  
  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
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
            Record a job and payment details
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : loadError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading jobs</AlertTitle>
            <AlertDescription>
              {loadError}
              <div className="mt-2">
                <p className="text-sm">Please make sure you have jobs created in the system.</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : jobs.length === 0 ? (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No jobs found</AlertTitle>
            <AlertDescription>
              You need to create jobs first before creating a job card.
            </AlertDescription>
          </Alert>
        ) : (
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
                        {jobs.map((job) => (
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
                        value={field.value}
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
                  onClick={handleCancel}
                  disabled={createJobCard.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createJobCard.isPending}>
                  {createJobCard.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Job Card'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobCardDialog;
