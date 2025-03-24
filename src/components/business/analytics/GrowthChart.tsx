
import React from "react";
import { LineChart } from "@/components/ui/chart";
import { getGrowthTrendsData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const defaultGrowthData = getGrowthTrendsData();
  const isMobile = useIsMobile();
  
  // Validate and prepare chart data
  const chartData = React.useMemo(() => {
    // If no data provided or invalid format, use default data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Using default growth data");
      return defaultGrowthData;
    }
    
    // Use provided data with the structure from default data
    console.log("Using provided growth data:", data);
    return {
      ...defaultGrowthData,
      datasets: [
        {
          ...defaultGrowthData.datasets[0],
          data: data
        }
      ]
    };
  }, [data, defaultGrowthData]);

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

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p>Loading growth data...</p>
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
