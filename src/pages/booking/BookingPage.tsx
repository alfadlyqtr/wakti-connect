
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
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { BookingTemplate } from "@/types/booking.types";
import { toast } from "@/components/ui/use-toast";
import { createBooking } from "@/services/booking";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const { templates, isLoading, error: templatesError } = useBookingTemplates(businessId);
  
  const [template, setTemplate] = useState<BookingTemplate | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (templates && templateId) {
      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        
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
      setBookingError("Missing required booking information");
      toast({
        title: "Error",
        description: "Missing required booking information",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const bookingDateTime = new Date(data.bookingDate);
      const [hours, minutes] = data.bookingTime.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes);

      const endDateTime = new Date(bookingDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + template.duration);

      console.log("Creating booking with the following data:", {
        business_id: businessId,
        service_id: template.service_id,
        staff_assigned_id: template.staff_assigned_id,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        title: `Booking for ${template.name}`,
        description: data.notes || null,
        start_time: bookingDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'pending',
        price: template.price
      });

      const booking = await createBooking({
        business_id: businessId,
        service_id: template.service_id,
        staff_assigned_id: template.staff_assigned_id,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        title: `Booking for ${template.name}`,
        description: data.notes || null,
        start_time: bookingDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'pending',
        price: template.price
      });

      toast({
        title: "Booking Confirmed",
        description: "Your booking has been submitted successfully!",
        variant: "success",
      });

      navigate(`/booking/confirmation/${booking.id}`, {
        state: {
          booking,
          templateName: template.name
        }
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      setBookingError(error.message || "There was a problem submitting your booking");
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

  if (templatesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Service</CardTitle>
            <CardDescription>
              We encountered a problem loading the booking service details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {templatesError.message || "Please try again later or contact support."}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardFooter>
        </Card>
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
          {bookingError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
          
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
