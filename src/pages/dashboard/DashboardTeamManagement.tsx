
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Clock } from "lucide-react";

// Import the components dynamically to avoid circular dependencies
const StaffManagementTab = React.lazy(() => import("@/components/staff/StaffManagementTab"));
const WorkLogsTab = React.lazy(() => import("@/components/staff/WorkLogsTab"));

const DashboardTeamManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team Management</h1>
        <p className="text-muted-foreground">Manage your staff members, track work hours, and monitor performance</p>
      </div>
      
      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="work-logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Work Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <StaffManagementTab />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="work-logs" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <WorkLogsTab />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTeamManagement;
