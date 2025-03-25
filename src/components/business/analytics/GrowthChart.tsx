
import React, { useEffect, useState } from "react";
import { LineChart } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const isMobile = useIsMobile();
  
  // Fetch real growth data from Supabase if the data prop is empty
  const { data: fetchedData, isLoading: fetchLoading } = useQuery({
    queryKey: ['growthChart'],
    queryFn: async () => {
      // Only fetch if no data was provided
      if (data && data.length > 0) {
        return { labels: [], datasets: [] };
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return { labels: [], datasets: [] };
      }
      
      const { data: growthData, error } = await supabase
        .from('business_growth_data')
        .select('month, subscribers')
        .eq('business_id', session.user.id)
        .eq('time_range', 'month')
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error fetching growth data:", error);
        return { labels: [], datasets: [] };
      }
      
      return {
        labels: growthData.map(item => item.month),
        datasets: [
          {
            label: 'Subscribers',
            data: growthData.map(item => item.subscribers),
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          }
        ]
      };
    },
    enabled: !data || data.length === 0, // Only run query if no data provided
    refetchOnWindowFocus: false,
  });

  // Prepare chart data
  const prepareChartData = () => {
    if (data && data.length > 0) {
      // Use the provided data
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Subscribers',
            data: data,
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          }
        ]
      };
    } else if (fetchedData && fetchedData.datasets && fetchedData.datasets.length > 0) {
      // Use the fetched data
      return fetchedData;
    } else {
      // Default empty data
      return {
        labels: [],
        datasets: [
          {
            label: 'Subscribers',
            data: [],
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          }
        ]
      };
    }
  };

  // Adjust chart options for mobile
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: !isMobile,
        },
        ticks: {
          display: !isMobile || window.innerWidth > 400,
          maxRotation: 90,
          minRotation: 45,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      }
    }
  };

  const actualLoading = isLoading || fetchLoading;
  const chartData = prepareChartData();

  if (actualLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>Loading growth data...</p>
      </div>
    );
  }

  if (chartData.labels.length === 0 || chartData.datasets[0].data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>No growth data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <LineChart 
        data={chartData} 
        options={chartOptions} 
      />
    </div>
  );
};
