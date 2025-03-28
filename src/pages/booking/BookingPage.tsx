
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { BookingTemplate } from "@/types/booking.types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Create form schema for validation
const bookingFormSchema = z.object({
  customerName: z.string().min(2, { message: "Please enter your name" }),
  customerEmail: z.string().email({ message: "Please enter a valid email" }),
  customerPhone: z.string().optional(),
  bookingDate: z.date({ required_error: "Please select a date" }),
  bookingTime: z.string({ required_error: "Please select a time" }),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingPage = () => {
  const { businessId, templateId } = useParams<{ businessId: string; templateId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { templates, isLoading } = useBookingTemplates(businessId);
  
  const [template, setTemplate] = useState<BookingTemplate | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  // Find the template from the templates array
  useEffect(() => {
    if (templates && templateId) {
      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        
        // Generate dummy time slots for now (9 AM to 5 PM)
        const times = [];
        for (let hour = 9; hour <= 17; hour++) {
          times.push(`${hour}:00`);
          if (hour < 17) times.push(`${hour}:30`);
        }
        setAvailableTimes(times);
      }
    }
  }, [templates, templateId]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!businessId || !templateId || !template) {
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
          price: template.price // Include price field
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been submitted successfully!",
        variant: "success",
      });

      // Redirect to confirmation page
      navigate(`/booking/confirmation/${booking.id}`, {
        state: {
          booking,
          templateName: template.name
        }
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Not Found</CardTitle>
            <CardDescription>
              The requested booking service could not be found.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Book {template?.name}</CardTitle>
          <CardDescription>
            Fill out the form below to book your appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
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
                              {availableTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
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

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                        {template?.price ? `$${template.price.toFixed(2)}` : "Free"}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
