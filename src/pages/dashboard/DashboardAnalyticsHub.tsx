
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
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/30">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-900/30">Tasks</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-blue-900/30">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 bg-black/20 backdrop-blur-xl border-white/5 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
              style={{
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                transform: 'perspective(1000px) rotateX(2deg)'
              }}>
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TasksOverviewChart />
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 backdrop-blur-xl border-white/5 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
              style={{
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                transform: 'perspective(1000px) rotateX(2deg)'
              }}>
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
          <Card className="bg-black/20 backdrop-blur-xl border-white/5 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              transform: 'perspective(1000px) rotateX(2deg)'
            }}>
            <CardHeader>
              <CardTitle className="text-white">Tasks Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TasksOverviewChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card className="bg-black/20 backdrop-blur-xl border-white/5 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              transform: 'perspective(1000px) rotateX(2deg)'
            }}>
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
