
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types/job.types';
import { Loader2 } from 'lucide-react';

const jobFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.string().refine((val) => !val || !isNaN(parseInt(val)), {
    message: "Duration must be a number",
  }),
  default_price: z.string().refine((val) => !val || !isNaN(parseFloat(val)), {
    message: "Price must be a number",
  })
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  job?: Job | null;
}

const JobFormDialog: React.FC<JobFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  mode = 'create',
  job 
}) => {
  const { createJob, updateJob } = useJobs();
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      default_price: ""
    }
  });
  
  // Set form values when editing
  useEffect(() => {
    if (mode === 'edit' && job) {
      form.reset({
        name: job.name,
        description: job.description || "",
        duration: job.duration?.toString() || "",
        default_price: job.default_price?.toString() || ""
      });
    }
  }, [job, mode, form]);
  
  const onSubmit = async (values: JobFormValues) => {
    try {
      const data = {
        name: values.name,
        description: values.description || null,
        duration: values.duration ? parseInt(values.duration) : null,
        default_price: values.default_price ? parseFloat(values.default_price) : null
      };
      
      if (mode === 'create') {
        await createJob.mutateAsync(data);
      } else if (mode === 'edit' && job) {
        await updateJob.mutateAsync({ id: job.id, data });
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  
  const title = mode === 'create' ? 'Create Job' : 'Edit Job';
  const isSubmitting = createJob.isPending || updateJob.isPending;
  const buttonText = mode === 'create' ? 'Create Job' : 'Update Job';
  const loadingText = mode === 'create' ? 'Creating...' : 'Updating...';
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) form.reset();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Haircut, Massage, Consultation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this job entails" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="default_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobFormDialog;
