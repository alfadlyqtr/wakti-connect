
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateGrowth } from "@/utils/businessReportsUtils";

export const SubscriberGrowthChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['subscriberGrowth'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_growth_data')
        .select('month, subscribers')
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
    
    const firstMonthSubscribers = data[0].subscribers;
    const lastMonthSubscribers = data[data.length - 1].subscribers;
    
    if (firstMonthSubscribers === 0) return "0%";
    
    const growth = calculateGrowth(lastMonthSubscribers, firstMonthSubscribers);
    return `${growth}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div className="animate-pulse">Loading subscriber growth data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>Subscriber data unavailable</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <div>No subscriber data available. Try refreshing the page.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
        <CardDescription>
          Monthly subscriber acquisition trend
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            subscribers: {
              label: 'Subscribers',
              color: '#2563eb',
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
              <Bar dataKey="subscribers" fill="var(--color-subscribers)" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {calculateGrowthRate()} growth in subscribers over the past 6 months
        </p>
      </CardFooter>
    </Card>
  );
};
