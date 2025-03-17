
import React from "react";
import { PieChart } from "@/components/ui/chart";
import { getServiceDistributionData } from "@/utils/businessAnalyticsUtils";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ isLoading, data }) => {
  const serviceData = getServiceDistributionData();
  
  // Use the provided data if available, otherwise fallback to the utility data
  if (data && data.length > 0) {
    serviceData.datasets[0].data = data;
  }

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
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }} 
          />
        </div>
      )}
    </div>
  );
};
