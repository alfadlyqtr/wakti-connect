
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";

const DashboardServiceManagement = () => {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Service Management</h1>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            <p>Services content here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4">
            <p>Categories content here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4">
            <p>Schedule content here</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
};

export default DashboardServiceManagement;
