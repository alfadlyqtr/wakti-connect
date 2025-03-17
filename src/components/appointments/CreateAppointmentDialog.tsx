
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
import { Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (appointment: AppointmentFormData, recurringData?: RecurringFormData) => Promise<any>;
  userRole: "free" | "individual" | "business";
  hasReachedMonthlyLimit?: boolean;
}

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onCreateAppointment,
  userRole,
  hasReachedMonthlyLimit = false
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
    
    if (!isPaidAccount && hasReachedMonthlyLimit) {
      toast({
        title: "Monthly Limit Reached",
        description: "Free accounts can only create one appointment per month. Upgrade for unlimited appointments.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isPaidAccount && !hasReachedMonthlyLimit) {
      toast({
        title: "Free Account",
        description: "You're creating your appointment for this month. Free accounts are limited to 1 appointment per month.",
        variant: "default"
      });
    }
    
    setIsSubmitting(true);
    try {
      // Format the date and time information
      const { date, startTime, endTime, isAllDay, title, description, location, isRecurring } = values;
      
      console.log("Form values being submitted:", values);
      
      const appointmentData: AppointmentFormData = {
        title: title.trim(),  // Make sure we're trimming the title
        description: description || undefined,
        location: location || undefined,
        is_all_day: isAllDay,
        status: "scheduled",
        appointment_type: "appointment"
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
      
      console.log("Appointment data being sent to the service:", appointmentData);
      
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
      console.error("Error in handleSubmit:", error);
      // Don't show toast here as it's already shown in the service
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If user has reached monthly limit and is on a free plan, show upgrade message
  if (userRole === "free" && hasReachedMonthlyLimit && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Monthly Limit Reached</DialogTitle>
            <DialogDescription>
              Free accounts can only create one appointment per month. Upgrade to an Individual or Business plan for unlimited appointments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 mt-4">
            <Button asChild>
              <Link to="/dashboard/upgrade">
                Upgrade Now <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new appointment.
            {userRole === "free" && !hasReachedMonthlyLimit && (
              <span className="block text-xs mt-1 text-wakti-blue">
                Free accounts can create 1 appointment per month.
              </span>
            )}
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
              hasReachedMonthlyLimit={hasReachedMonthlyLimit && userRole === "free"}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
