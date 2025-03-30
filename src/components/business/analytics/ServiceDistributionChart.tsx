
import React, { useEffect, useState } from "react";
import { PieChart } from "@/components/ui/chart";
import { getServiceDistributionData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ isLoading, data }) => {
  const [chartData, setChartData] = useState<any>(null);
  const defaultServiceData = getServiceDistributionData();
  const isMobile = useIsMobile();
  
  // Validate and prepare chart data
  useEffect(() => {
    // If no data provided or invalid format, use default data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("Using default service distribution data");
      setChartData(defaultServiceData);
      return;
    }
    
    try {
      // Use provided data with the structure from default data
      console.log("Using provided service distribution data:", data);
      setChartData({
        ...defaultServiceData,
        datasets: [
          {
            ...defaultServiceData.datasets[0],
            data: data
          }
        ]
      });
    } catch (error) {
      console.error("Error processing service distribution data:", error);
      setChartData(defaultServiceData);
    }
  }, [data, defaultServiceData]);

  // Mobile-optimized chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: isMobile ? 10 : 12,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 11 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 11 : 12,
        },
        titleFont: {
          size: isMobile ? 12 : 14,
        }
      }
    },
    layout: {
      padding: {
        top: isMobile ? 5 : 10,
        bottom: isMobile ? 15 : 5
      }
    }
  };

  if (isLoading || !chartData) {
    return (
      <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
        <p>Loading service data...</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] md:h-[300px] w-full flex justify-center">
      <div className={`h-full ${isMobile ? 'w-full' : 'w-full max-w-[400px]'}`}>
        <PieChart 
          data={chartData} 
          options={chartOptions} 
        />
      </div>
    </div>
  );
};
