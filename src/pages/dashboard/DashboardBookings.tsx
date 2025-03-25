import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Loader2, Calendar, Clock, User, Mail, CheckCircle, XCircle, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookingTab, BookingWithRelations, BookingStatus } from "@/types/booking.types";

const DashboardBookings = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("all-bookings");
  const queryClient = useQueryClient();
  
  // Fetch bookings based on the selected tab
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          service:service_id(name, description, price),
          staff:staff_assigned_id(name)
        `)
        .eq('business_id', await getUserId());
        
      // Filter based on active tab
      if (activeTab === "pending-bookings") {
        query = query.eq('status', 'pending');
      } else if (activeTab === "staff-bookings") {
        query = query.not('staff_assigned_id', 'is', null);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data to handle potential relation errors
      const safeBookings: BookingWithRelations[] = data.map(booking => ({
        ...booking,
        service: booking.service && !booking.service.error ? booking.service : null,
        staff: booking.staff && !booking.staff.error ? booking.staff : null
      }));
      
      return {
        bookings: safeBookings,
        userRole: "business" as const
      };
    }
  });

  // Mutation to update booking status
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: BookingStatus }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      return { bookingId, status };
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Send notification to customer
      sendStatusNotification(data.bookingId, data.status);
      
      toast({
        title: `Booking ${data.status}`,
        description: `The booking has been ${data.status}.`,
        variant: "success"
      });
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the booking status.",
        variant: "destructive"
      });
    }
  });
  
  // Send notification to customer when booking status changes
  const sendStatusNotification = async (bookingId: string, status: BookingStatus) => {
    try {
      // Get booking details
      const { data: booking } = await supabase
        .from('bookings')
        .select('customer_id, customer_name, title')
        .eq('id', bookingId)
        .single();
        
      if (booking?.customer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.customer_id,
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            content: `Your booking for "${booking.title}" has been ${status}.`,
            type: "booking_update",
            related_entity_id: bookingId,
            related_entity_type: "booking"
          });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  
  // Helper function to get the current user ID
  const getUserId = async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    return session.user.id;
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-500 mb-2">Error loading bookings</div>
            <p className="text-muted-foreground">{(error as Error).message}</p>
            <Button 
              className="mt-4" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookings = data?.bookings || [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActiveTab("all-bookings")}>
              All Bookings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("pending-bookings")}>
              Pending Bookings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("staff-bookings")}>
              Staff Assigned Bookings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="pending-bookings">Pending</TabsTrigger>
          <TabsTrigger value="staff-bookings">Staff Assigned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-bookings">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'p')} - 
                            {format(parseISO(booking.end_time), 'p')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_email}</span>
                        </div>
                      </div>
                      
                      <div>
                        {booking.service && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">Service:</span>
                            <span className="text-sm ml-2">{booking.service.name}</span>
                            {booking.service.price !== null && (
                              <div className="text-sm mt-1">
                                Price: QAR {booking.service.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <span className="text-sm font-medium">Provider:</span>
                          <span className="text-sm ml-2">
                            {booking.staff?.name || 'Not assigned'}
                          </span>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'confirmed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'completed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Completed
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending-bookings">
          {bookings.filter(booking => booking.status === 'pending').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No pending bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.filter(booking => booking.status === 'pending').map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'p')} - 
                            {format(parseISO(booking.end_time), 'p')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_email}</span>
                        </div>
                      </div>
                      
                      <div>
                        {booking.service && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">Service:</span>
                            <span className="text-sm ml-2">{booking.service.name}</span>
                            {booking.service.price !== null && (
                              <div className="text-sm mt-1">
                                Price: QAR {booking.service.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <span className="text-sm font-medium">Provider:</span>
                          <span className="text-sm ml-2">
                            {booking.staff?.name || 'Not assigned'}
                          </span>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'confirmed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'completed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Completed
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="staff-bookings">
          {bookings.filter(booking => booking.staff_assigned_id !== null).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No staff assigned bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.filter(booking => booking.staff_assigned_id !== null).map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {format(parseISO(booking.start_time), 'p')} - 
                            {format(parseISO(booking.end_time), 'p')}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{booking.customer_email}</span>
                        </div>
                      </div>
                      
                      <div>
                        {booking.service && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">Service:</span>
                            <span className="text-sm ml-2">{booking.service.name}</span>
                            {booking.service.price !== null && (
                              <div className="text-sm mt-1">
                                Price: QAR {booking.service.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <span className="text-sm font-medium">Provider:</span>
                          <span className="text-sm ml-2">
                            {booking.staff?.name || 'Not assigned'}
                          </span>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'confirmed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              size="sm" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'completed'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Completed
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => updateBookingMutation.mutate({
                                bookingId: booking.id,
                                status: 'cancelled'
                              })}
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
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
