
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksOverviewChart } from "@/components/analytics/TasksOverviewChart";
import { TeamActivityChart } from "@/components/analytics/TeamActivityChart";
import { MetricCards } from "@/components/analytics/MetricCards";
import { UserActivityTable } from "@/components/analytics/UserActivityTable";

const DashboardAnalyticsHub = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Analytics Hub</h1>
        <p className="text-blue-300/80 text-sm sm:text-base">
          Track your business performance and team productivity
        </p>
      </div>

      <MetricCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-black/20 border border-white/10 backdrop-blur-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900/40 data-[state=active]:to-blue-800/30 data-[state=active]:border-blue-500/30 data-[state=active]:border data-[state=active]:backdrop-blur-xl"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900/40 data-[state=active]:to-blue-800/30 data-[state=active]:border-blue-500/30 data-[state=active]:border data-[state=active]:backdrop-blur-xl"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900/40 data-[state=active]:to-blue-800/30 data-[state=active]:border-blue-500/30 data-[state=active]:border data-[state=active]:backdrop-blur-xl"
          >
            Team
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TasksOverviewChart />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <UserActivityTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card className="overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader>
              <CardTitle className="text-white">Tasks Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TasksOverviewChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card className="overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader>
              <CardTitle className="text-white">Team Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TeamActivityChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalyticsHub;
