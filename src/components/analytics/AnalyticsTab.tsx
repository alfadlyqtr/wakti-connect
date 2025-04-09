
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, Calendar, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Fetch real analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("Not authenticated");
      }

      // Fetch revenue data
      const { data: revenueData } = await supabase
        .from('job_cards')
        .select('created_at, payment_amount')
        .eq('staff_relation_id', session.user.id)
        .order('created_at', { ascending: true });
      
      // Process revenue by month
      const monthlyRevenue = processRevenueByMonth(revenueData || []);
      
      // Fetch appointment data
      const { data: appointmentsData } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('business_id', session.user.id)
        .order('start_time', { ascending: true });
      
      // Process appointments by day of week
      const appointmentsByDay = processAppointmentsByDay(appointmentsData || []);
      
      // Fetch service distribution data
      const { data: servicesData } = await supabase
        .from('business_services')
        .select('id, name')
        .eq('business_id', session.user.id);
      
      // Get booking counts for each service
      const serviceDistribution = await getServiceDistribution(servicesData || [], session.user.id);
      
      // Get total revenue, appointment count and customer count
      const totalRevenue = (revenueData || []).reduce((sum, item) => sum + (parseFloat(String(item.payment_amount)) || 0), 0);
      const appointmentCount = (appointmentsData || []).length;
      
      // Get customer count (unique customer IDs)
      const { data: customerData } = await supabase
        .from('bookings')
        .select('customer_id')
        .eq('business_id', session.user.id)
        .not('customer_id', 'is', null);
      
      const uniqueCustomers = new Set();
      (customerData || []).forEach(booking => {
        if (booking.customer_id) uniqueCustomers.add(booking.customer_id);
      });
      
      return {
        totalRevenue: totalRevenue.toFixed(2),
        appointmentCount,
        customerCount: uniqueCustomers.size,
        revenueData: monthlyRevenue,
        appointmentsData: appointmentsByDay,
        servicesData: serviceDistribution
      };
    },
  });

  // Helper function to process revenue data by month
  const processRevenueByMonth = (data: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals: {[key: string]: number} = {};
    
    // Initialize all months with zero
    months.forEach(month => {
      monthlyTotals[month] = 0;
    });
    
    // Sum revenues by month
    data.forEach(item => {
      const date = new Date(item.created_at);
      const month = months[date.getMonth()];
      monthlyTotals[month] += parseFloat(String(item.payment_amount)) || 0;
    });
    
    // Convert to chart format
    return Object.keys(monthlyTotals)
      .map(month => ({ name: month, value: monthlyTotals[month] }))
      .sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
  };

  // Helper function to process appointments by day of week
  const processAppointmentsByDay = (data: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    data.forEach(item => {
      const date = new Date(item.start_time);
      const dayIndex = date.getDay();
      counts[dayIndex]++;
    });
    
    return days.map((day, index) => ({ name: day, value: counts[index] }));
  };

  // Helper function to get service distribution
  const getServiceDistribution = async (services: any[], businessId: string) => {
    if (!services || services.length === 0) {
      return [];
    }
    
    // For each service, count related bookings
    const serviceData = await Promise.all(services.map(async (service) => {
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('service_id', service.id);
      
      return {
        name: service.name,
        value: count || 0
      };
    }));
    
    // Return services with non-zero bookings
    return serviceData.filter(item => item.value > 0);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-32" />
                </CardTitle>
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // If no data is available, show placeholder content
  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">No revenue data yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">No appointments yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">No customers yet</p>
            </CardContent>
          </Card>
        </div>

        <div className="p-8 text-center">
          <p className="text-muted-foreground">No analytics data available yet. Start booking appointments and tracking jobs to see your analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.revenueData?.length ? 'All time revenue' : 'No revenue recorded'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.appointmentCount}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.appointmentCount ? 'Total appointments' : 'No appointments recorded'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customerCount}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.customerCount ? 'Unique customers' : 'No customers yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {analyticsData.revenueData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>
                Weekly appointment patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {analyticsData.appointmentsData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={analyticsData.appointmentsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No appointment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>
                Breakdown of services by usage
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {analyticsData.servicesData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.servicesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No service data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;
