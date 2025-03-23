
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { JobCardFormData } from '@/types/job.types';

// Define the schema
const jobCardSchema = z.object({
  job_id: z.string().min(1, "Job selection is required"),
  payment_method: z.enum(["cash", "pos", "none"], {
    required_error: "Payment method is required"
  }),
  payment_amount: z.coerce.number().min(0),
  notes: z.string().optional()
});

export type JobCardFormValues = z.infer<typeof jobCardSchema>;

interface JobCardFormProps {
  jobs: any[];
  onSubmit: (values: JobCardFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const JobCardForm: React.FC<JobCardFormProps> = ({ 
  jobs, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
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
  
  return (
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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
  );
};

export default JobCardForm;
