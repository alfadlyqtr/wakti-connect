
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PieChart as RechartsPieChart, Pie as RechartsPie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { ResponsiveContainer } from "recharts";
import { COLORS } from "@/utils/businessReportsUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ServicePopularityChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceDistribution'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_service_distribution')
        .select('service_name, usage_count')
        .eq('business_id', session.user.id)
        .eq('time_range', 'month');
        
      if (error) throw error;
      
      return data?.map(item => ({
        name: item.service_name,
        value: item.usage_count
      })) || [];
    }
  });
  
  const totalBookings = data ? data.reduce((acc, item) => acc + item.value, 0) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Popularity</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div className="animate-pulse">Loading service distribution data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Popularity</CardTitle>
          <CardDescription>Service distribution data unavailable</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div>No service data available. Try refreshing the page.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Popularity</CardTitle>
        <CardDescription>
          Distribution of bookings by service type
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex justify-center">
        <ResponsiveContainer width="80%" height="100%">
          <RechartsPieChart>
            <RechartsPie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RechartsPie>
            <RechartsTooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Based on {totalBookings} bookings in the last 30 days
        </p>
      </CardFooter>
    </Card>
  );
};
