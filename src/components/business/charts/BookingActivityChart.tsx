
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateGrowth } from "@/utils/businessReportsUtils";

export const BookingActivityChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookingActivity'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_booking_activity')
        .select('month, bookings')
        .eq('business_id', session.user.id)
        .eq('time_range', 'month')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Calculate growth rate
  const calculateGrowthRate = () => {
    if (!data || data.length < 2) return "0%";
    
    const firstMonthBookings = data[0].bookings;
    const lastMonthBookings = data[data.length - 1].bookings;
    
    if (firstMonthBookings === 0) return "0%";
    
    const growth = calculateGrowth(lastMonthBookings, firstMonthBookings);
    return `${growth}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Activity</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div className="animate-pulse">Loading booking activity data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Activity</CardTitle>
          <CardDescription>Booking data unavailable</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div>No booking data available. Try refreshing the page.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Activity</CardTitle>
        <CardDescription>
          Monthly booking trends
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            bookings: {
              label: 'Bookings',
              color: '#10b981',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                content={
                  <ChartTooltipContent />
                }
              />
              <Bar dataKey="bookings" fill="var(--color-bookings)" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {calculateGrowthRate()} increase in bookings over the past 6 months
        </p>
      </CardFooter>
    </Card>
  );
};
