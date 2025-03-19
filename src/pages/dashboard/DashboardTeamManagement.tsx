
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Clock } from "lucide-react";

// Import the components
import StaffManagementTab from "@/components/staff/StaffManagementTab";
import WorkLogsTab from "@/components/staff/WorkLogsTab";

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
          <StaffManagementTab />
        </TabsContent>
        
        <TabsContent value="work-logs" className="mt-0">
          <WorkLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTeamManagement;
