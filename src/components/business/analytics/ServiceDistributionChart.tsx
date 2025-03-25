
import React from "react";
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
  
  // Fetch real service distribution data from Supabase
  const { data: fetchedData, isLoading: fetchLoading } = useQuery({
    queryKey: ['serviceDistributionChart'],
    queryFn: async () => {
      try {
        // Get current user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No authenticated user session");
          return { labels: [], datasets: [] };
        }
        
        // First get the actual business services
        const { data: services, error: servicesError } = await supabase
          .from('business_services')
          .select('id, name')
          .eq('business_id', session.user.id);
          
        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          return { labels: [], datasets: [] };
        }
        
        if (!services || services.length === 0) {
          console.log("No services found for this business");
          return { labels: [], datasets: [] };
        }
        
        // Get the booking counts for each service
        const serviceCountsPromises = services.map(async (service) => {
          const { count, error: countError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', session.user.id)
            .eq('service_id', service.id);
            
          if (countError) {
            console.error(`Error fetching count for service ${service.name}:`, countError);
            return { name: service.name, count: 0 };
          }
          
          return { name: service.name, count: count || 0 };
        });
        
        const serviceCounts = await Promise.all(serviceCountsPromises);
        
        // Create the chart data
        return {
          labels: serviceCounts.map(item => item.name),
          datasets: [
            {
              label: 'Service Distribution',
              data: serviceCounts.map(item => item.count),
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(6, 182, 212, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(249, 115, 22, 0.7)'
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(236, 72, 153, 1)',
                'rgba(6, 182, 212, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(249, 115, 22, 1)'
              ],
              borderWidth: 1,
              hoverOffset: 4,
            }
          ]
        };
      } catch (error) {
        console.error("Error in fetchServiceDistribution:", error);
        return { labels: [], datasets: [] };
      }
    },
    refetchOnWindowFocus: false,
  });

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
  
  // Use fetched data if available, otherwise use the provided data
  const chartData = fetchedData && fetchedData.labels && fetchedData.labels.length > 0 
    ? fetchedData 
    : {
        labels: data && data.length > 0 ? ['Service 1', 'Service 2', 'Service 3', 'Service 4'] : [],
        datasets: [
          {
            label: 'Service Distribution',
            data: data || [],
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
        <p>No service distribution data available. Please create services and bookings first.</p>
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
