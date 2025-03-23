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
  
  // Validate and prepare chart data
  const chartData = React.useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Use provided data if available and valid
      return {
        ...growthData,
        datasets: [
          {
            ...growthData.datasets[0],
            data: data
          }
        ]
      };
    }
    
    // Otherwise return the default data
    return growthData;
  }, [data, growthData]);

  // Adjust chart options for mobile
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>Loading growth data...</p>
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
    <div className="h-[300px] w-full">
      <LineChart 
        data={chartData} 
        options={chartOptions} 
      />
    </div>
  );
};
