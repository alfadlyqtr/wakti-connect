
import React from "react";
import { useForm } from "react-hook-form";
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
import { Appointment } from "@/types/appointment.types";
import { AppointmentFormFields } from "./AppointmentFormFields";
import { AppointmentFormValues, getDefaultFormValues } from "./AppointmentFormSchema";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (appointment: Partial<Appointment>) => Promise<any>;
  userRole: "free" | "individual" | "business";
}

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onCreateAppointment,
  userRole
}: CreateAppointmentDialogProps) {
  const form = useForm<AppointmentFormValues>({
    defaultValues: getDefaultFormValues()
  });
  
  const handleSubmit = async (values: AppointmentFormValues) => {
    // Combine date and time values
    const startDate = new Date(values.date);
    const endDate = new Date(values.date);
    
    if (!values.isAllDay) {
      const [startHours, startMinutes] = values.startTime.split(':').map(Number);
      const [endHours, endMinutes] = values.endTime.split(':').map(Number);
      
      startDate.setHours(startHours, startMinutes, 0);
      endDate.setHours(endHours, endMinutes, 0);
    } else {
      // For all-day events, set times to beginning and end of day
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }
    
    await onCreateAppointment({
      title: values.title,
      description: values.description,
      location: values.location,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      is_all_day: values.isAllDay
    });
    
    onOpenChange(false);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new appointment or event.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <AppointmentFormFields form={form} />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
