
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useServiceQueries } from "@/hooks/useServiceQueries";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "@/components/ui/use-toast";
import { addHours, format, setHours, setMinutes } from "date-fns";

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Form schema for booking creation
const BookingFormSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z.string().optional(),
  service_id: z.string().optional(),
  customer_name: z.string().min(1, { message: "Customer name is required" }),
  customer_email: z.string().email({ message: "Valid email is required" }).optional(),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string({ required_error: "Start time is required" }),
  endTime: z.string({ required_error: "End time is required" }),
  staff_assigned_id: z.string().optional(),
});

type BookingFormValues = z.infer<typeof BookingFormSchema>;

const CreateBookingDialog: React.FC<CreateBookingDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess 
}) => {
  const { createBooking } = useBookings();
  const { services, isLoading: isLoadingServices } = useServiceQueries();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      customer_name: "",
      customer_email: "",
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format the date and time for the API
      const startDateTime = new Date(data.date);
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      setHours(startDateTime, startHours);
      setMinutes(startDateTime, startMinutes);
      
      const endDateTime = new Date(data.date);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);
      setHours(endDateTime, endHours);
      setMinutes(endDateTime, endMinutes);
      
      // Create booking data object
      const bookingData = {
        title: data.title,
        description: data.description,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        service_id: data.service_id,
        staff_assigned_id: data.staff_assigned_id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: "confirmed" as const,
      };
      
      await createBooking(bookingData);
      
      toast({
        title: "Booking Created",
        description: "The booking has been created successfully",
      });
      
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error creating booking",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set service duration when service is selected
  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find((service) => service.id === serviceId);
    
    if (selectedService) {
      const startTime = form.getValues("startTime");
      const [hours, minutes] = startTime.split(":").map(Number);
      
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = addHours(startDate, selectedService.duration / 60);
      const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
      
      form.setValue("endTime", endTime);
      form.setValue("title", selectedService.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Booking title" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Booking details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customer_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleServiceChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingServices ? (
                        <SelectItem value="loading" disabled>
                          Loading services...
                        </SelectItem>
                      ) : services.length > 0 ? (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({service.duration} min)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No services available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingDialog;
