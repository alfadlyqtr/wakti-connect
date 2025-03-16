
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { getGrowthTrendsData } from "@/utils/businessAnalyticsUtils";

export const GrowthChart = () => {
  const growthData = getGrowthTrendsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Metrics</CardTitle>
        <CardDescription>
          Subscriber growth and task completion
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <LineChart 
          data={growthData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }} 
        />
      </CardContent>
    </Card>
  );
};
