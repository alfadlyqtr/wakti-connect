
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { getAppointmentsData, getStaffPerformanceData } from "@/utils/businessAnalyticsUtils";

export const AppointmentCharts = () => {
  const appointmentsData = getAppointmentsData();
  const staffData = getStaffPerformanceData();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Trends</CardTitle>
          <CardDescription>
            Number of appointments per month
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <BarChart 
            data={appointmentsData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
          <CardDescription>
            Hours worked by staff members
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <BarChart 
            data={staffData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y' as const,
            }} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
