
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AppointmentFormValues, appointmentFormSchema, getDefaultFormValues } from "./AppointmentFormSchema";
import { AppointmentFormContent } from "./AppointmentFormContent";
import { AppointmentDialogFooter } from "./AppointmentDialogFooter";
import { AppointmentFormData } from "@/types/appointment.types";
import { RecurringFormData } from "@/types/recurring.types";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (appointment: AppointmentFormData, recurringData?: RecurringFormData) => Promise<any>;
  userRole: "free" | "individual" | "business";
}

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onCreateAppointment,
  userRole
}: CreateAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getDefaultFormValues()
  });
  
  const handleSubmit = async (values: AppointmentFormValues) => {
    setHasAttemptedSubmit(true);
    
    if (!isPaidAccount) {
      toast({
        title: "Premium Feature",
        description: "Creating appointments is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Format the date and time information
      const { date, startTime, endTime, isAllDay, title, description, location, isRecurring } = values;
      
      const appointmentData: AppointmentFormData = {
        title,
        description: description || undefined,
        location: location || undefined,
        is_all_day: isAllDay,
        status: "scheduled",
      };
      
      // Add date/time information
      if (isAllDay) {
        // For all-day events, set times to start of day and end of day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        appointmentData.start_time = startDate.toISOString();
        appointmentData.end_time = endDate.toISOString();
      } else {
        // For timed events, combine the date with the selected times
        if (startTime) {
          const [startHours, startMinutes] = startTime.split(':').map(Number);
          const startDate = new Date(date);
          startDate.setHours(startHours, startMinutes);
          appointmentData.start_time = startDate.toISOString();
        }
        
        if (endTime) {
          const [endHours, endMinutes] = endTime.split(':').map(Number);
          const endDate = new Date(date);
          endDate.setHours(endHours, endMinutes);
          appointmentData.end_time = endDate.toISOString();
        }
      }
      
      // Get recurring data if appointment is recurring
      const recurringData = isRecurring ? values.recurring as RecurringFormData : undefined;
      
      await onCreateAppointment(appointmentData, recurringData);
      
      // Reset form and close dialog
      form.reset(getDefaultFormValues());
      setHasAttemptedSubmit(false);
      onOpenChange(false);
      
      toast({
        title: "Appointment Created",
        description: "Your appointment has been successfully created.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new appointment.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <AppointmentFormContent 
              form={form} 
              isPaidAccount={isPaidAccount} 
              isSubmitting={isSubmitting}
              userRole={userRole}
            />
            
            <AppointmentDialogFooter
              isSubmitting={isSubmitting}
              isPaidAccount={isPaidAccount}
              hasAttemptedSubmit={hasAttemptedSubmit}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
