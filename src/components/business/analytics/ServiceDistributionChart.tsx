import React from "react";
import { PieChart } from "@/components/ui/chart";
import { getServiceDistributionData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ isLoading, data }) => {
  const serviceData = getServiceDistributionData();
  const isMobile = useIsMobile();
  
  // Validate and prepare chart data
  const chartData = React.useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Use provided data if available and valid
      return {
        ...serviceData,
        datasets: [
          {
            ...serviceData.datasets[0],
            data: data
          }
        ]
      };
    }
    
    // Otherwise return the default data
    return serviceData;
  }, [data, serviceData]);

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

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>Loading service data...</p>
      </div>
    );
  }

  // Fallback for invalid data
  if (!chartData || !chartData.datasets || !chartData.labels) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-red-500">
        <p>Error loading chart data</p>
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
