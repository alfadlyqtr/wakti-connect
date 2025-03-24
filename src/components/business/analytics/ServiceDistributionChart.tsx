
import React from "react";
import { PieChart } from "@/components/ui/chart";
import { getServiceDistributionData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ isLoading, data }) => {
  const defaultServiceData = getServiceDistributionData();
  const isMobile = useIsMobile();
  
  // Validate and prepare chart data
  const chartData = React.useMemo(() => {
    // If no data provided or invalid format, use default data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Using default service distribution data");
      return defaultServiceData;
    }
    
    // Use provided data with the structure from default data
    console.log("Using provided service distribution data:", data);
    return {
      ...defaultServiceData,
      datasets: [
        {
          ...defaultServiceData.datasets[0],
          data: data
        }
      ]
    };
  }, [data, defaultServiceData]);

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
