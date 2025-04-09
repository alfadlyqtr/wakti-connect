
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton"; 
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface RevenueOverviewProps {
  serviceCount: number | undefined;
  servicesLoading: boolean;
  onDownload: () => void;
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  serviceCount,
  servicesLoading,
  onDownload
}) => {
  const chartColors = {
    completed: "#22c55e",
    pending: "#f59e0b",
    cancelled: "#ef4444"
  };

  // Mock data that would ideally come from the database
  const data = [
    {
      name: 'January',
      completed: 400,
      pending: 240,
      cancelled: 20,
    },
    {
      name: 'February',
      completed: 300,
      pending: 138,
      cancelled: 10,
    },
    {
      name: 'March',
      completed: 200,
      pending: 98,
      cancelled: 30,
    },
    {
      name: 'April',
      completed: 278,
      pending: 38,
      cancelled: 0,
    },
    {
      name: 'May',
      completed: 189,
      pending: 48,
      cancelled: 8,
    },
  ];
  
  return (
    <Card className="mt-6 col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Bookings Overview
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {servicesLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <>
                <span className="font-medium">{serviceCount || 0}</span> services offered
              </>
            )}
          </div>
        </div>
        <Button onClick={onDownload} variant="outline" size="sm">
          <DownloadIcon className="h-3.5 w-3.5 mr-2" />
          Download Report
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 0,
                left: -10,
                bottom: 0,
              }}
              barSize={15}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} tickMargin={8} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill={chartColors.completed} />
              <Bar dataKey="pending" name="Pending" fill={chartColors.pending} />
              <Bar dataKey="cancelled" name="Cancelled" fill={chartColors.cancelled} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-2">
          Note: This is mock data for UI presentation. Will be replaced with real booking data in the next update.
        </div>
      </CardContent>
    </Card>
  );
};
