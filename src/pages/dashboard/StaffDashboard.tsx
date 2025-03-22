
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardShell from "@/components/dashboard/DashboardShell";

const StaffDashboard = () => {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>
      
      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Staff Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Staff management functionality has been removed from this version.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default StaffDashboard;
