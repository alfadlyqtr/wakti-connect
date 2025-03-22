
import React from "react";
import StaffManagementPanel from "@/components/staff/StaffManagementPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Clock } from "lucide-react";
import WorkLogsTab from "./staff-management/WorkLogsTab";

const DashboardStaffManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
        <p className="text-muted-foreground">
          Create and manage staff accounts, control permissions, and track work logs.
        </p>
      </div>
      
      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Staff Accounts
          </TabsTrigger>
          <TabsTrigger value="work-logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Work Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="mt-0">
          <StaffManagementPanel />
        </TabsContent>
        
        <TabsContent value="work-logs" className="mt-0">
          <WorkLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardStaffManagement;
