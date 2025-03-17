
import React from "react";
import { LineChart } from "@/components/ui/chart";
import { getGrowthTrendsData } from "@/utils/businessAnalyticsUtils";
import { Card, CardContent } from "@/components/ui/card";

interface GrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ isLoading, data }) => {
  const growthData = getGrowthTrendsData();
  
  // Use the provided data if available, otherwise fallback to the utility data
  if (data && data.length > 0) {
    growthData.datasets[0].data = data;
  }

  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <p>Loading growth data...</p>
        </div>
      ) : (
        <LineChart 
          data={growthData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }} 
        />
      )}
    </div>
  );
};
