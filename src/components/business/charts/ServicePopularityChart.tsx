
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PieChart as RechartsPieChart, Pie as RechartsPie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { ResponsiveContainer } from "recharts";
import { servicePopularityData, COLORS } from "@/utils/businessReportsUtils";

export const ServicePopularityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Popularity</CardTitle>
        <CardDescription>
          Distribution of bookings by service type
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex justify-center">
        <ResponsiveContainer width="80%" height="100%">
          <RechartsPieChart>
            <RechartsPie
              data={servicePopularityData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {servicePopularityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RechartsPie>
            <RechartsTooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Based on {servicePopularityData.reduce((acc, item) => acc + item.value, 0)} bookings in the last 30 days
        </p>
      </CardFooter>
    </Card>
  );
};
