
import React, { useEffect, useState } from "react";
import { LineChart } from "@/components/ui/chart";
import { getGrowthTrendsData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const [chartData, setChartData] = useState<any>(null);
  const defaultGrowthData = getGrowthTrendsData();
  const isMobile = useIsMobile();
  
  // Validate and prepare chart data
  useEffect(() => {
    // If no data provided or invalid format, use default data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Using default growth data");
      setChartData(defaultGrowthData);
      return;
    }
    
    try {
      // Use provided data with the structure from default data
      console.log("Using provided growth data:", data);
      setChartData({
        ...defaultGrowthData,
        datasets: [
          {
            ...defaultGrowthData.datasets[0],
            data: data
          }
        ]
      });
    } catch (error) {
      console.error("Error processing growth data:", error);
      setChartData(defaultGrowthData);
    }
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

  if (isLoading || !chartData) {
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
