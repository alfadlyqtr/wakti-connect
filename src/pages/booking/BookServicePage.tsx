
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Loader2, Clock, Calendar as CalendarIcon, ArrowLeft, User, Mail } from "lucide-react";
import { Service } from "@/types/service.types";
import { BookingFormData, BookingStatus } from "@/types/booking.types";
import { format } from "date-fns";

const BookServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  // Get current user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthUser(session.user);
        
        // If logged in, get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, display_name')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setCustomerName(profile.display_name || profile.full_name || '');
          setCustomerEmail(session.user.email || '');
        }
      }
    };
    
    getUser();
  }, []);

  // Fetch service details
  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) throw new Error("Service ID is required");
      
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('id', serviceId)
        .single();
        
      if (error) throw error;
      return data as Service;
    },
    enabled: !!serviceId
  });

  // Fetch staff members assigned to this service
  const { data: staffMembers, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['serviceStaff', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      
      // Get staff assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('staff_service_assignments')
        .select('staff_id')
        .eq('service_id', serviceId);
        
      if (assignmentsError) throw assignmentsError;
      
      if (!assignments || assignments.length === 0) return [];
      
      const staffIds = assignments.map(a => a.staff_id);
      
      // Get staff details
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('id, name, role, is_service_provider')
        .in('id', staffIds)
        .eq('is_service_provider', true);
        
      if (staffError) throw staffError;
      
      return staffData || [];
    },
    enabled: !!serviceId
  });

  // Set end time based on service duration when start time changes
  useEffect(() => {
    if (startTime && service?.duration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + service.duration * 60000);
      const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
      
      setEndTime(endTimeStr);
    }
  }, [startTime, service?.duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId || !date || !startTime || !selectedStaffId || !customerName || !customerEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const startDate = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      // Create booking data with properly named fields and typed status
      const bookingData = {
        business_id: service?.business_id || '',
        title: `Booking for ${service?.name}`,
        service_id: serviceId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_id: authUser?.id,
        staff_assigned_id: selectedStaffId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        status: 'pending' as BookingStatus
      };
      
      // Insert booking
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Create notification for service provider
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedStaffId,
          title: "New Booking",
          content: `You have a new booking for ${service?.name} on ${format(startDate, 'PPP')} at ${format(startDate, 'p')}`,
          type: "booking",
          related_entity_id: data.id,
          related_entity_type: "booking"
        });
        
      // Create notification for business owner
      if (service?.business_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: service.business_id,
            title: "New Booking Request",
            content: `New booking for ${service.name} from ${customerName}`,
            type: "booking",
            related_entity_id: data.id,
            related_entity_type: "booking"
          });
      }
      
      toast({
        title: "Booking Successful",
        description: "Your booking has been submitted and is pending confirmation.",
        variant: "success"
      });
      
      // Redirect to confirmation page or back to services
      navigate(`/booking/confirmation/${data.id}`);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "An error occurred while submitting your booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingService || isLoadingStaff) {
    return (
      <div className="container max-w-4xl mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-6">The service you are looking for could not be found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isStaffAvailable = staffMembers && staffMembers.length > 0;

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Services
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Book Service</h1>
      <p className="text-muted-foreground mb-8">Complete the form below to book this service.</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Information about the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{service.duration} minutes</span>
              </div>
              
              {service.price !== null && (
                <div className="font-semibold">
                  QAR {service.price.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <CardDescription>Select date, time and provider</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="booking-form" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Date selection */}
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()} 
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Time selection */}
                  <div className="space-y-2">
                    <Label>Select Start Time</Label>
                    <TimePicker
                      value={startTime}
                      onChange={setStartTime}
                      interval={15}
                    />
                    
                    {startTime && (
                      <div className="text-sm text-muted-foreground mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>End Time: {endTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Staff selection */}
                  <div className="space-y-2">
                    <Label>Select Service Provider</Label>
                    {isStaffAvailable ? (
                      <RadioGroup 
                        value={selectedStaffId} 
                        onValueChange={setSelectedStaffId}
                        className="grid gap-2"
                      >
                        {staffMembers.map((staff) => (
                          <div key={staff.id} className="flex items-center space-x-2 border p-3 rounded-md">
                            <RadioGroupItem value={staff.id} id={`staff-${staff.id}`} />
                            <Label htmlFor={`staff-${staff.id}`} className="flex flex-col">
                              <span className="font-medium">{staff.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {staff.role === 'co-admin' ? 'Manager' : 'Staff'}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="border p-4 rounded-md text-center text-amber-600 bg-amber-50">
                        No service providers are currently available for this service.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Customer information */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Your Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Full Name
                      </Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email Address
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="booking-form" 
                className="w-full" 
                disabled={isSubmitting || !isStaffAvailable}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Book Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
