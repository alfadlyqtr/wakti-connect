
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Calendar, Clock, UserCheck, CheckCircle, XCircle } from "lucide-react";
import { Booking, BookingStatus, BookingTab } from "@/types/booking.types";
import { format, parseISO } from "date-fns";

const DashboardBookings = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("all-bookings");
  
  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['bookings', activeTab],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Not authenticated");
      }
      
      // Start with getting all bookings for this business
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (name, description, price),
          staff:staff_assigned_id (name)
        `)
        .eq('business_id', session.session.user.id);
      
      // Filter by status for pending tab
      if (activeTab === "pending-bookings") {
        query = query.eq('status', 'pending');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { 
        bookings: data as Booking[],
        userRole: "business"
      };
    }
  });
  
  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Get booking details for notification
      const { data: booking } = await supabase
        .from('bookings')
        .select('customer_id, title, service_id')
        .eq('id', bookingId)
        .single();
      
      // Add notification for customer if they have an account
      if (booking?.customer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.customer_id,
            title: `Booking ${status === 'confirmed' ? 'Confirmed' : 'Cancelled'}`,
            content: `Your booking for "${booking.title}" has been ${status === 'confirmed' ? 'confirmed' : 'cancelled'}.`,
            type: "booking_update",
            related_entity_id: bookingId,
            related_entity_type: "booking"
          });
      }
      
      toast({
        title: `Booking ${status === 'confirmed' ? 'Confirmed' : 'Cancelled'}`,
        description: `The booking has been ${status === 'confirmed' ? 'confirmed' : 'cancelled'} successfully.`,
        variant: status === 'confirmed' ? 'success' : 'default'
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message || "An error occurred while updating the booking status",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }
  
  const bookings = bookingsData?.bookings || [];
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
        <p className="text-muted-foreground">View and manage customer bookings for your services</p>
      </div>
      
      <Tabs 
        defaultValue="all-bookings" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as BookingTab)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all-bookings" className="flex items-center gap-2">
            All Bookings
            {bookings.length > 0 && (
              <Badge variant="secondary">{bookings.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending-bookings" className="flex items-center gap-2">
            Pending Bookings
            {pendingBookings.length > 0 && (
              <Badge variant="secondary">{pendingBookings.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-bookings" className="mt-0">
          {bookings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Bookings</CardTitle>
                <CardDescription>
                  No bookings have been made for your services yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once customers book your services, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.title}</CardTitle>
                        <CardDescription>
                          {booking.services?.name || 'Unknown Service'}
                        </CardDescription>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.start_time), 'PPP')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.start_time), 'p')} - {format(parseISO(booking.end_time), 'p')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Service Provider</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.staff?.name || 'Not assigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.customer_name} ({booking.customer_email})
                        </p>
                      </div>
                      
                      {booking.services?.price && (
                        <div className="text-right">
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm font-bold">
                            QAR {booking.services.price.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {booking.status === 'pending' && (
                    <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button 
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending-bookings" className="mt-0">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Pending Bookings</CardTitle>
                <CardDescription>
                  There are no pending bookings that require your attention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When customers make booking requests, they will appear here for your approval.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.title}</CardTitle>
                        <CardDescription>
                          {booking.services?.name || 'Unknown Service'}
                        </CardDescription>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.start_time), 'PPP')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.start_time), 'p')} - {format(parseISO(booking.end_time), 'p')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Service Provider</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.staff?.name || 'Not assigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.customer_name} ({booking.customer_email})
                        </p>
                      </div>
                      
                      {booking.services?.price && (
                        <div className="text-right">
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm font-bold">
                            QAR {booking.services.price.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button 
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBookings;
