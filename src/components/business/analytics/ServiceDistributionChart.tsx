
import React, { useEffect, useState } from "react";
import { PieChart } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ServiceDistributionChartProps {
  isLoading: boolean;
  data: any[];
  labels?: string[];
}

export const ServiceDistributionChart: React.FC<ServiceDistributionChartProps> = ({ 
  isLoading, 
  data = [],
  labels = [] 
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const isMobile = useIsMobile();
  
  // Prepare chart data
  useEffect(() => {
    if (!data || data.length === 0 || !labels || labels.length === 0) {
      console.log("No service distribution data available");
      setChartData(null);
      return;
    }
    
    try {
      // Format chart data
      setChartData({
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error("Error preparing service distribution chart data:", error);
      setChartData(null);
    }
  }, [data, labels]);

  // Mobile-optimized chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' as const : 'right' as const,
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
      },
      datalabels: {
        display: false
      }
    },
    radius: isMobile ? '80%' : '90%',
    layout: {
      padding: {
        top: 5,
        bottom: isMobile ? 30 : 5,
        left: 5,
        right: 5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
        <p>Loading service data...</p>
      </div>
    );
  }

  // No data available
  if (!chartData || data.length === 0 || labels.length === 0) {
    return (
      <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
        <Alert variant="default" className="max-w-md">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            No service distribution data available. Add services and receive bookings to see this chart.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className={`${isMobile ? 'h-[220px] w-full' : 'h-[280px] w-[85%]'}`}>
        <PieChart 
          data={chartData} 
          options={chartOptions} 
        />
      </div>
    </div>
  );
};
