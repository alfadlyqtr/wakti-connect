
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { subscriberData } from "@/utils/businessReportsUtils";

export const SubscriberGrowthChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
        <CardDescription>
          Monthly subscriber acquisition trend
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            subscribers: {
              label: 'Subscribers',
              color: '#2563eb',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subscriberData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                content={
                  <ChartTooltipContent />
                }
              />
              <Bar dataKey="subscribers" fill="var(--color-subscribers)" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          600% growth in subscribers over the past 6 months
        </p>
      </CardFooter>
    </Card>
  );
};
