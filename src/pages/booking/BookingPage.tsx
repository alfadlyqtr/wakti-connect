
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, parse } from "date-fns";
import { CalendarIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { BookingTemplate } from "@/types/booking.types";
import { toast } from "@/components/ui/use-toast";
import { createBooking } from "@/services/booking";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { supabase } from "@/integrations/supabase/client";

const bookingFormSchema = z.object({
  customerName: z.string().min(2, { message: "Please enter your name" }),
  customerEmail: z.string().email({ message: "Please enter a valid email" }),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to proceed",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingPage = () => {
  const { businessId, templateId } = useParams<{ businessId: string; templateId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { templates, isLoading, error: templatesError } = useBookingTemplates(businessId);
  
  const [template, setTemplate] = useState<BookingTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{name?: string, email?: string} | null>(null);

  // Get URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    
    if (dateParam) {
      setBookingDate(new Date(dateParam));
    }
    
    if (timeParam) {
      setBookingTime(timeParam);
    }
  }, [location.search]);

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsUserLoggedIn(true);
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserProfile({
            name: profile.full_name,
            email: profile.email || session.user.email
          });
        } else {
          setUserProfile({
            email: session.user.email
          });
        }
      }
    };
    
    checkSession();
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
      agreeToTerms: false,
    },
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) {
        form.setValue('customerName', userProfile.name);
      }
      if (userProfile.email) {
        form.setValue('customerEmail', userProfile.email);
      }
    }
  }, [userProfile, form]);

  useEffect(() => {
    if (templates && templateId) {
      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
      }
    }
  }, [templates, templateId]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!businessId || !templateId || !template || !bookingDate || !bookingTime) {
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
      // Parse the time string (e.g., "9:30 AM") to hours and minutes
      const timeParts = bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeParts) {
        throw new Error("Invalid time format");
      }
      
      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const period = timeParts[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      
      // Create the start date/time
      const startDateTime = new Date(bookingDate);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on template duration
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + template.duration);
      
      const booking = await createBooking({
        business_id: businessId,
        service_id: template.service_id,
        staff_assigned_id: template.staff_assigned_id,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        title: `Booking for ${template.name}`,
        description: data.notes || null,
        start_time: startDateTime.toISOString(),
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

  if (templatesError || !template) {
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
                {templatesError?.message || "Please try again later or contact support."}
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

  const { formatCurrency } = useCurrencyFormat();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-xl">{template.name}</CardTitle>
          <CardDescription>
            {bookingDate && bookingTime && (
              <div className="mt-2 font-medium text-foreground">
                {format(bookingDate, "EEEE, MMMM d, yyyy")} at {bookingTime}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {bookingError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center mb-6">
            {template.price ? (
              <div className="text-lg font-bold">{formatCurrency(template.price)}</div>
            ) : (
              <div className="text-lg font-bold">Free</div>
            )}
            <div className="text-sm text-muted-foreground">Duration: {template.duration} minutes</div>
          </div>
          
          {isUserLoggedIn ? (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">Signed in as:</span>
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-sm">{userProfile?.name}</p>
                <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
              </div>
            </div>
          ) : null}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests or information" 
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
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          id="agreeToTerms"
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="agreeToTerms" className="text-sm font-normal">
                        I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a>
                      </FormLabel>
                      <FormMessage />
                    </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
