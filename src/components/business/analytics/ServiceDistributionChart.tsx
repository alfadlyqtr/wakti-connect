
import React, { useEffect, useState } from "react";
import { PieChart } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ isLoading, data }) => {
  const isMobile = useIsMobile();
  
  // Fetch real service distribution data from Supabase if the data prop is empty
  const { data: fetchedData, isLoading: fetchLoading } = useQuery({
    queryKey: ['serviceDistributionChart'],
    queryFn: async () => {
      // Only fetch if no data was provided
      if (data && data.length > 0) {
        return { labels: [], datasets: [] };
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return { labels: [], datasets: [] };
      }
      
      const { data: serviceData, error } = await supabase
        .from('business_service_distribution')
        .select('service_name, usage_count')
        .eq('business_id', session.user.id)
        .eq('time_range', 'month');
        
      if (error) {
        console.error("Error fetching service distribution data:", error);
        return { labels: [], datasets: [] };
      }
      
      return {
        labels: serviceData.map(item => item.service_name),
        datasets: [
          {
            label: 'Service Distribution',
            data: serviceData.map(item => item.usage_count),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(236, 72, 153, 0.7)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
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
        labels: ['Consulting', 'Design', 'Development', 'Maintenance'],
        datasets: [
          {
            label: 'Service Distribution',
            data: data,
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
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
            label: 'Service Distribution',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            hoverOffset: 4,
          }
        ]
      };
    }
  };

  // Configure options based on device size
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right' as 'bottom' | 'right',
        labels: {
          boxWidth: isMobile ? 10 : 15,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        enabled: true,
      }
    }
  };

  const actualLoading = isLoading || fetchLoading;
  const chartData = prepareChartData();

  if (actualLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>Loading service data...</p>
      </div>
    );
  }

  if (chartData.labels.length === 0 || chartData.datasets[0].data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>No service distribution data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full flex justify-center">
      <div className="h-full w-full max-w-[500px]">
        <PieChart 
          data={chartData} 
          options={chartOptions} 
        />
      </div>
    </div>
  );
};
