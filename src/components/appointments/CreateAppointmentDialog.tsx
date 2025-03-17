import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
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
  
  useEffect(() => {
    if (open) {
      form.reset(getDefaultFormValues());
      setIsRecurring(false);
      setHasAttemptedSubmit(false);
    }
  }, [open, form]);
  
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
      const startDate = new Date(values.date);
      const endDate = new Date(values.date);
      
      if (!values.isAllDay && values.startTime && values.endTime) {
        const [startHours, startMinutes] = values.startTime.split(':').map(Number);
        const [endHours, endMinutes] = values.endTime.split(':').map(Number);
        
        startDate.setHours(startHours, startMinutes, 0);
        endDate.setHours(endHours, endMinutes, 0);
      } else {
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
      
      let retries = 0;
      const maxRetries = 3;
      let result = null;
      
      while (retries < maxRetries) {
        try {
          result = await onCreateAppointment(appointmentData, recurringData);
          break;
        } catch (createError: any) {
          console.error(`Attempt ${retries + 1} - Error creating appointment:`, createError);
          
          if (
            createError.message?.includes("violates row-level security policy") || 
            createError.message?.includes("connection error") ||
            createError.message?.includes("timeout")
          ) {
            retries++;
            
            if (retries >= maxRetries) {
              throw createError;
            }
            
            const delay = 1000 * Math.pow(2, retries);
            toast({
              title: "Retrying...",
              description: `Attempt ${retries} of ${maxRetries}. Please wait.`,
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw createError;
          }
        }
      }
      
      onOpenChange(false);
      form.reset();
      setIsRecurring(false);
      setHasAttemptedSubmit(false);
      
      return result;
    } catch (error: any) {
      console.error("Error in CreateAppointmentDialog:", error);
      
      // Error toasts are already handled in the service layer
      
      // Keep the dialog open so the user can see the error and potentially retry
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
            {!isPaidAccount && (
              <div className="mt-2 text-destructive font-medium">
                Creating appointments is a premium feature. Please upgrade your plan.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <AppointmentFormFields form={form} disabled={!isPaidAccount || isSubmitting} />
            
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="recurring-appointment"
                checked={isRecurring}
                onCheckedChange={(checked) => {
                  setIsRecurring(checked);
                  form.setValue("isRecurring", checked);
                }}
                disabled={!isPaidAccount || isSubmitting}
              />
              <Label htmlFor="recurring-appointment">
                Make this a recurring appointment {!isPaidAccount && "(Premium)"}
              </Label>
            </div>
            
            {isRecurring && <RecurringFormFields form={form} userRole={userRole} disabled={isSubmitting} />}
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={!isPaidAccount || isSubmitting}
                className={!isPaidAccount ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Appointment"
                )}
              </Button>
              
              {hasAttemptedSubmit && !isPaidAccount && (
                <p className="text-destructive text-sm mt-2">
                  This feature is only available for Individual and Business plans. Please upgrade to create appointments.
                </p>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
