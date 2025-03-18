
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
  
  // Use the provided data if available, otherwise fallback to the utility data
  if (data && data.length > 0) {
    serviceData.datasets[0].data = data;
  }

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
      }
    }
  };

  return (
    <div className="h-[300px] w-full flex justify-center">
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <p>Loading service data...</p>
        </div>
      ) : (
        <div className="h-full w-full max-w-[500px]">
          <PieChart 
            data={serviceData} 
            options={chartOptions} 
          />
        </div>
      )}
    </div>
  );
};
