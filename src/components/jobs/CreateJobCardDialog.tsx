
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
import { useJobCards } from "@/hooks/useJobCards";
import { JobCardFormData } from "@/types/jobs.types";
import { formatDateTimeToISO } from "@/utils/formatUtils";
import JobCardFormFields from "./JobCardFormFields";
import JobCardDialogControls from "./JobCardDialogControls";
import { supabase } from "@/integrations/supabase/client";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<JobCardFormValues>({
    resolver: zodResolver(jobCardFormSchema),
    defaultValues: {
      job_id: "",
      payment_method: "none",
      payment_amount: 0,
      notes: "",
      start_time: "",
      end_time: ""
    }
  });
  
  // Fetch jobs from business when dialog opens
  useEffect(() => {
    if (open) {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          // Get the business ID for the staff member
          const businessId = await getStaffBusinessId();
          
          if (!businessId) {
            console.error("No business ID found for staff");
            toast({
              title: "Error",
              description: "Could not determine your business",
              variant: "destructive"
            });
            return;
          }
          
          // Fetch jobs for this business
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('business_id', businessId)
            .order('name');
            
          if (error) {
            console.error("Error fetching jobs:", error);
            toast({
              title: "Error",
              description: "Could not load jobs",
              variant: "destructive"
            });
            return;
          }
          
          setJobs(data || []);
        } catch (error) {
          console.error("Error in fetchJobs:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchJobs();
    }
  }, [open, toast]);
  
  const onSubmit = async (data: JobCardFormValues) => {
    try {
      // Convert the selected date and times to ISO format
      const timeData = formatDateTimeToISO(selectedDate, startTime, endTime);
      
      // Make sure required fields are present
      const jobCardData: JobCardFormData = {
        job_id: data.job_id,
        payment_method: data.payment_method,
        payment_amount: data.payment_amount,
        start_time: timeData.start_time,
        end_time: timeData.end_time,
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
      toast({
        title: "Error",
        description: "Failed to create job card" + (error instanceof Error ? `: ${error.message}` : ""),
        variant: "destructive"
      });
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
            Record a completed job and payment details
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <JobCardFormFields
                jobs={jobs}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
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
