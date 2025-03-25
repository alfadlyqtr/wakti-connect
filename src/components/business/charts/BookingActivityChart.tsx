
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { bookingData } from "@/utils/businessReportsUtils";

export const BookingActivityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Activity</CardTitle>
        <CardDescription>
          Monthly booking trends
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            bookings: {
              label: 'Bookings',
              color: '#10b981',
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bookingData}
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
              <Bar dataKey="bookings" fill="var(--color-bookings)" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          350% increase in bookings over the past 6 months
        </p>
      </CardFooter>
    </Card>
  );
};
