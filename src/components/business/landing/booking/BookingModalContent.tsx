
import React, { useState, useEffect } from "react";
import { BookingTemplate, BookingTemplateAvailability } from "@/types/booking.types";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, parse, isAfter, isBefore } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, CheckCircle, Loader2, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface BookingModalContentProps {
  businessId: string;
  template: BookingTemplate;
  onClose: () => void;
}

// Booking form schema
const bookingFormSchema = z.object({
  customerName: z.string().min(2, { message: "Please enter your name" }),
  customerEmail: z.string().email({ message: "Please enter a valid email" }),
  customerPhone: z.string().optional(),
  bookingDate: z.date({ required_error: "Please select a date" }),
  bookingTime: z.string({ required_error: "Please select a time" }),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingModalContent: React.FC<BookingModalContentProps> = ({ businessId, template, onClose }) => {
  const { formatCurrency } = useCurrencyFormat();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availability, setAvailability] = useState<BookingTemplateAvailability[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerEmail: user?.email || "",
      customerPhone: "",
      bookingDate: new Date(),
      notes: "",
    },
  });

  // Watch for date changes to update available times
  const selectedDate = form.watch("bookingDate");

  // If user is logged in, pre-fill the form
  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue("customerName", user.name || "");
      form.setValue("customerEmail", user.email || "");
    }
  }, [isAuthenticated, user, form]);

  // Fetch template availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoadingAvailability(true);
        const { data, error } = await supabase
          .from('booking_template_availability')
          .select('*')
          .eq('template_id', template.id);

        if (error) throw error;
        
        setAvailability(data || []);
        console.log("Template availability:", data);
      } catch (error) {
        console.error("Error fetching template availability:", error);
        toast({
          title: "Error",
          description: "Failed to load availability. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    if (template?.id) {
      fetchAvailability();
    }
  }, [template]);

  // Generate available time slots based on selected date
  useEffect(() => {
    if (!selectedDate || !template) return;
    
    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = selectedDate.getDay();
    
    // Find availability for this day
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (dayAvailability && dayAvailability.is_available) {
      // Parse start and end times
      const startTime = parse(dayAvailability.start_time, "HH:mm", new Date());
      const endTime = parse(dayAvailability.end_time, "HH:mm", new Date());
      
      // Generate time slots
      const slots = [];
      const appointmentDuration = template.duration;
      let currentTime = startTime;
      
      while (isBefore(currentTime, endTime)) {
        slots.push(format(currentTime, "HH:mm"));
        
        // Add appointment duration to current time
        currentTime = new Date(currentTime.getTime() + appointmentDuration * 60000);
        
        // If adding another appointment would exceed end time, break
        if (isAfter(new Date(currentTime.getTime() + appointmentDuration * 60000), endTime)) {
          break;
        }
      }
      
      setAvailableTimes(slots);
    } else {
      // Default slots if no availability data
      const defaultSlots = [];
      // Generate time slots from 9 AM to 5 PM
      for (let hour = 9; hour <= 17; hour++) {
        defaultSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 17) defaultSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      setAvailableTimes(defaultSlots);
    }
  }, [selectedDate, template, availability]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!businessId || !template) {
      toast({
        title: "Error",
        description: "Missing required booking information",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date and time for the booking
      const bookingDateTime = new Date(data.bookingDate);
      const [hours, minutes] = data.bookingTime.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes);

      // Calculate end time based on template duration
      const endDateTime = new Date(bookingDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + template.duration);

      // Create booking record
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          business_id: businessId,
          service_id: template.service_id,
          staff_assigned_id: template.staff_assigned_id,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone, // Include phone field
          title: `Booking for ${template.name}`,
          description: data.notes || null,
          start_time: bookingDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'pending',
          // Add price from template to the booking for reference
          price: template.price
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been submitted successfully!",
        variant: "success",
      });

      setIsSuccess(true);
      
      // Navigate to confirmation page after a short delay
      setTimeout(() => {
        navigate(`/booking/confirmation/${booking.id}`, {
          state: {
            booking,
            templateName: template.name
          }
        });
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was a problem submitting your booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground mb-6">
          Your booking has been successfully submitted. You'll be redirected to the confirmation page shortly.
        </p>
        <div className="mt-4">
          <Loader2 className="animate-spin h-6 w-6 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      <div className="md:col-span-2">
        {!isAuthenticated && (
          <div className="mb-6 p-4 border border-primary/20 rounded-md bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium">Already have a WAKTI account?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign in to auto-fill your details and manage all your bookings in one place.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleSignIn}>
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                            date > addDays(new Date(), 30)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAvailability ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : availableTimes.length > 0 ? (
                          availableTimes.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            No available times for this date
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Any special requests or information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div>
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Service</Label>
                <p className="font-medium">{template?.name}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Duration</Label>
                <p>{template?.duration} minutes</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Price</Label>
                <p className="font-bold text-primary">
                  {template?.price ? formatCurrency(template.price) : "Free"}
                </p>
              </div>
              
              {template?.description && (
                <div>
                  <Label className="text-muted-foreground text-sm">Description</Label>
                  <p className="text-sm">{template.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingModalContent;
