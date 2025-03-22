
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";

const DashboardWorkManagement = () => {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Work Management</h1>
      </div>

      <div className="grid gap-6">
        <ActiveWorkSession />
        
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Work History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4">
              <p>Work history has been removed from this version.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4">
              <p>Report functionality has been removed from this version.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default DashboardWorkManagement;
