
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { formatDateTimeToISO } from "@/utils/formatUtils";
import JobCardFormFields from "./JobCardFormFields";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobCardDialog;
