
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StaffDashboardHeader from "@/components/dashboard/StaffDashboardHeader";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";

const StaffDashboard = () => {
  return (
    <DashboardShell>
      <StaffDashboardHeader />
      
      <div className="grid gap-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Current Work Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Work management has been disabled in this version.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have no assigned tasks.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have no upcoming bookings.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <ActiveWorkSession />
        
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-4">
            <p>You have no tasks assigned.</p>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <p>You have no bookings.</p>
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-4">
            <p>Earnings tracking is not available in this version.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default StaffDashboard;
