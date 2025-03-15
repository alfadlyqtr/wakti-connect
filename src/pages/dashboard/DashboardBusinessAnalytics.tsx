
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { 
  UsersRound, 
  TrendingUp, 
  Calendar, 
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Placeholder data for charts
const getChartData = () => {
  // Appointments data by month
  const appointmentsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 17, 21, 25, 22, 26, 24, 28, 25, 32],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };
  
  // Staff activity data
  const staffData = {
    labels: ['Alice', 'Bob', 'Charlie', 'Dana', 'Edward'],
    datasets: [
      {
        label: 'Hours Worked',
        data: [37, 42, 35, 28, 45],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };
  
  // Growth trend data
  const growthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Subscribers',
        data: [15, 18, 22, 25, 30, 35, 42, 50],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Tasks Completed',
        data: [8, 12, 18, 25, 32, 38, 45, 55],
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        fill: false
      }
    ]
  };
  
  // Service distribution data
  const serviceData = {
    labels: ['Haircut', 'Coloring', 'Styling', 'Spa', 'Nails'],
    datasets: [
      {
        label: 'Service Bookings',
        data: [35, 25, 22, 18, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  return { appointmentsData, staffData, growthData, serviceData };
};

const DashboardBusinessAnalytics = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const { appointmentsData, staffData, growthData, serviceData } = getChartData();

  // Fetch analytics data
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // In a real app, this would fetch actual analytical data from Supabase
      // For now, we'll return placeholder data
      return {
        subscriberCount: 157,
        appointmentCount: 352,
        staffCount: 5,
        taskCompletionRate: 87
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
        <p className="text-muted-foreground">Track your business growth and performance metrics.</p>
      </div>
      
      <div className="flex justify-end">
        <Tabs defaultValue={timeRange} className="w-[300px]" onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Error loading analytics data</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscribers
                </CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.subscriberCount}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.appointmentCount}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Staff
                </CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.staffCount}</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Task Completion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.taskCompletionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last {timeRange}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Growth Trends</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                <span>Services</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Trends</CardTitle>
                  <CardDescription>
                    Number of appointments per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={appointmentsData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Staff Performance</CardTitle>
                  <CardDescription>
                    Hours worked by staff members
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={staffData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y' as const,
                    }} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>
                    Subscriber growth and task completion
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <LineChart 
                    data={growthData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of service bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex justify-center">
                  <div className="h-full w-full max-w-[500px]">
                    <PieChart 
                      data={serviceData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DashboardBusinessAnalytics;
