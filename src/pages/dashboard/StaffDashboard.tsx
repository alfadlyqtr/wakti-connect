
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StaffDashboardHeader } from '@/components/dashboard/StaffDashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStaffStatus } from '@/hooks/staff/useStaffStatus';
import ActiveWorkSession from '@/components/staff/ActiveWorkSession';

export default function StaffDashboard() {
  const { isClocked, isLoading, clockIn, clockOut } = useStaffStatus();
  
  return (
    <DashboardShell>
      <StaffDashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <ActiveWorkSession 
            isClocked={isClocked}
            onClockIn={clockIn}
            onClockOut={clockOut}
            isLoading={isLoading}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center py-4">
                No assigned tasks for today
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Outlet />
    </DashboardShell>
  );
}
