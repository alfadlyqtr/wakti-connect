
import React from "react";
import { LineChart } from "@/components/ui/chart";
import { getGrowthTrendsData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const growthData = getGrowthTrendsData();
  const isMobile = useIsMobile();
  
  // Use the provided data if available, otherwise fallback to the utility data
  if (data && data.length > 0) {
    growthData.datasets[0].data = data;
  }

  // Adjust chart options for mobile
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          display: !isMobile || window.innerWidth > 400,
          maxRotation: 90,
          minRotation: 45,
        }
      }
    }
  };

  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <p>Loading growth data...</p>
        </div>
      ) : (
        <LineChart 
          data={growthData} 
          options={chartOptions} 
        />
      )}
    </div>
  );
};
