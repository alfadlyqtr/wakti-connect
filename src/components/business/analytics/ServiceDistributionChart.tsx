
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart } from "@/components/ui/chart";
import { getServiceDistributionData } from "@/utils/businessAnalyticsUtils";

export const ServiceDistributionChart = () => {
  const serviceData = getServiceDistributionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Distribution</CardTitle>
        <CardDescription>
          Breakdown of service bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex justify-center">
        <div className="h-full w-full max-w-[500px]">
          <PieChart 
            data={serviceData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
