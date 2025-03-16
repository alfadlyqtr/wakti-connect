
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AppointmentFormFields } from "./AppointmentFormFields";
import { AppointmentFormValues, appointmentFormSchema, getDefaultFormValues } from "./AppointmentFormSchema";
import RecurringFormFields from "@/components/recurring/RecurringFormFields";
import { toast } from "@/components/ui/use-toast";
import { AppointmentFormData } from "@/types/appointment.types";
import { RecurringFormData } from "@/types/recurring.types";

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
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      ...getDefaultFormValues(),
      isRecurring: false,
      recurring: {
        frequency: "daily",
        interval: 1,
        days_of_week: [],
      }
    }
  });
  
  const handleSubmit = async (values: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine date and time values
      const startDate = new Date(values.date);
      const endDate = new Date(values.date);
      
      if (!values.isAllDay && values.startTime && values.endTime) {
        const [startHours, startMinutes] = values.startTime.split(':').map(Number);
        const [endHours, endMinutes] = values.endTime.split(':').map(Number);
        
        startDate.setHours(startHours, startMinutes, 0);
        endDate.setHours(endHours, endMinutes, 0);
      } else {
        // For all-day events, set times to beginning and end of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }
      
      const appointmentData: AppointmentFormData = {
        title: values.title,
        description: values.description,
        location: values.location,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        is_all_day: values.isAllDay
      };
      
      const recurringData = values.isRecurring ? values.recurring as RecurringFormData : undefined;
      
      await onCreateAppointment(appointmentData, recurringData);
      
      onOpenChange(false);
      form.reset();
      setIsRecurring(false);
    } catch (error: any) {
      if (error.message === "This feature is only available for paid accounts") {
        toast({
          title: "Premium Feature",
          description: "Recurring appointments are only available for paid accounts. Please upgrade your plan.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error creating appointment",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
      }
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
            Fill in the details to create a new appointment or event.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <AppointmentFormFields form={form} />
            
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="recurring-appointment"
                checked={isRecurring}
                onCheckedChange={(checked) => {
                  setIsRecurring(checked);
                  form.setValue("isRecurring", checked);
                }}
                disabled={!isPaidAccount}
              />
              <Label htmlFor="recurring-appointment">
                Make this a recurring appointment {!isPaidAccount && "(Premium)"}
              </Label>
            </div>
            
            {isRecurring && <RecurringFormFields form={form} userRole={userRole} />}
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  "Create Appointment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
