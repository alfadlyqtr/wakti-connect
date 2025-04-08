
import React, { useEffect, useState } from "react";
import { LineChart } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const [chartData, setChartData] = useState<any>(null);
  const isMobile = useIsMobile();
  
  // Prepare chart data
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No growth data available");
      return;
    }
    
    try {
      // Default month labels if none provided
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
      // Format chart data
      setChartData({
        labels,
        datasets: [{
          label: 'Subscribers',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      });
    } catch (error) {
      console.error("Error preparing growth chart data:", error);
    }
  }, [data]);

  // Mobile-optimized chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: 'top' as const,
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
    scales: {
      x: {
        grid: {
          display: !isMobile,
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          },
          maxRotation: isMobile ? 30 : 0,
          minRotation: isMobile ? 30 : 0,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          },
          // Limit number of ticks on mobile
          maxTicksLimit: isMobile ? 5 : 10
        }
      }
    }
  };

  if (isLoading || !chartData) {
    return (
      <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
        <p>Loading growth data...</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] md:h-[300px] w-full">
      <LineChart 
        data={chartData} 
        options={chartOptions} 
      />
    </div>
  );
};
