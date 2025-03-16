
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Calendar, DollarSign, Clock } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell
} from "recharts";
import { 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const subscriberData = [
  { month: 'Jan', subscribers: 5 },
  { month: 'Feb', subscribers: 12 },
  { month: 'Mar', subscribers: 18 },
  { month: 'Apr', subscribers: 25 },
  { month: 'May', subscribers: 31 },
  { month: 'Jun', subscribers: 35 },
];

const bookingData = [
  { month: 'Jan', bookings: 8 },
  { month: 'Feb', bookings: 15 },
  { month: 'Mar', bookings: 22 },
  { month: 'Apr', bookings: 30 },
  { month: 'May', bookings: 27 },
  { month: 'Jun', bookings: 36 },
];

const servicePopularityData = [
  { name: 'Consultation', value: 35 },
  { name: 'Treatment', value: 25 },
  { name: 'Checkup', value: 20 },
  { name: 'Followup', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardBusinessReports = () => {
  const { data: subscriberCount, isLoading: subscribersLoading } = useQuery({
    queryKey: ['businessSubscribers'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: staffCount, isLoading: staffLoading } = useQuery({
    queryKey: ['businessStaffCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: serviceCount, isLoading: servicesLoading } = useQuery({
    queryKey: ['businessServiceCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_services')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });

  const handleDownloadReport = () => {
    // This would generate a report file in a real application
    console.log("Downloading report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Reports</h1>
          <p className="text-muted-foreground">Track your business performance and analyze key metrics.</p>
        </div>
        <Button className="md:self-start" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-wakti-blue" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {subscribersLoading ? (
                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              ) : (
                subscriberCount
              )}
            </div>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-wakti-blue" />
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-wakti-blue" />
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {staffLoading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                staffCount
              )}
            </div>
            <p className="text-sm text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Growth</CardTitle>
              <CardDescription>
                Monthly subscriber acquisition trend
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  subscribers: {
                    label: 'Subscribers',
                    color: '#2563eb',
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subscriberData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Bar dataKey="subscribers" fill="var(--color-subscribers)" barSize={30} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                600% growth in subscribers over the past 6 months
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Activity</CardTitle>
              <CardDescription>
                Monthly booking trends
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  bookings: {
                    label: 'Bookings',
                    color: '#10b981',
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" barSize={30} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                350% increase in bookings over the past 6 months
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Popularity</CardTitle>
              <CardDescription>
                Distribution of bookings by service type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex justify-center">
              <ResponsiveContainer width="80%" height="100%">
                <RechartsPieChart>
                  <RechartsPie
                    data={servicePopularityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicePopularityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Based on {servicePopularityData.reduce((acc, item) => acc + item.value, 0)} bookings in the last 30 days
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Financial performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Monthly Revenue</p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">$5,240</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="ml-1">from last month</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Average Booking Value</p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">$67.18</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">+3.2%</span>
                  <span className="ml-1">from last month</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Services Offered</p>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {servicesLoading ? (
                    <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                  ) : (
                    serviceCount
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active services available for booking
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Detailed Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardBusinessReports;
