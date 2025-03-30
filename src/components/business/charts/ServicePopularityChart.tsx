
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PieChart } from "@/components/ui/chart";
import { servicePopularityData, COLORS } from "@/utils/businessReportsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

export const ServicePopularityChart = () => {
  const isMobile = useIsMobile();
  
  // Prepare data for Chart.js format
  const chartData = {
    labels: servicePopularityData.map(item => item.name),
    datasets: [
      {
        data: servicePopularityData.map(item => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS.map(color => color),
        borderWidth: 1,
      }
    ]
  };
  
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
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} bookings (${percentage}%)`;
          }
        }
      }
    },
    // Adjust the radius for mobile
    radius: isMobile ? '80%' : '90%',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Popularity</CardTitle>
        <CardDescription>
          Distribution of bookings by service type
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'h-[260px]' : 'h-[300px]'} flex justify-center`}>
        <div className={`${isMobile ? 'w-full h-[220px]' : 'w-[85%] h-full'}`}>
          <PieChart 
            data={chartData}
            options={chartOptions}
          />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Based on {servicePopularityData.reduce((acc, item) => acc + item.value, 0)} bookings in the last 30 days
        </p>
      </CardFooter>
    </Card>
  );
};
