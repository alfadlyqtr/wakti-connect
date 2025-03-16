
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Appointment } from "@/hooks/useAppointments";
import { format, addHours, setHours, setMinutes } from "date-fns";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (appointment: Partial<Appointment>) => Promise<any>;
  userRole: "free" | "individual" | "business";
}

interface AppointmentFormValues {
  title: string;
  description: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onCreateAppointment,
  userRole
}: CreateAppointmentDialogProps) {
  const today = new Date();
  const startTime = format(setHours(setMinutes(today, 0), today.getHours() + 1), 'HH:mm');
  const endTime = format(addHours(setHours(setMinutes(today, 0), today.getHours() + 1), 1), 'HH:mm');
  
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: today,
      startTime,
      endTime,
      isAllDay: false
    }
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
  
  const watchIsAllDay = form.watch("isAllDay");
  
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter appointment title..." {...field} required />
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
                    <Textarea 
                      placeholder="Enter appointment details..." 
                      {...field} 
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker 
                      date={field.value} 
                      setDate={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>All-day Event</FormLabel>
                    <FormDescription>
                      Toggle if this is an all-day event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {!watchIsAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
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
