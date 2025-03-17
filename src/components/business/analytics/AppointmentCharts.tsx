
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for demonstration
const appointmentData = [
  { month: 'Jan', appointments: 20, bookings: 15 },
  { month: 'Feb', appointments: 30, bookings: 22 },
  { month: 'Mar', appointments: 25, bookings: 18 },
  { month: 'Apr', appointments: 40, bookings: 30 },
  { month: 'May', appointments: 35, bookings: 28 },
  { month: 'Jun', appointments: 45, bookings: 40 },
];

const statusData = [
  { status: 'Completed', value: 45 },
  { status: 'Cancelled', value: 15 },
  { status: 'Scheduled', value: 30 },
  { status: 'Confirmed', value: 10 },
];

export function AppointmentCharts() {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="status">Status Distribution</TabsTrigger>
      </TabsList>
      
      <TabsContent value="appointments" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Appointments vs Bookings</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#4f46e5" name="Appointments" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="status" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="status" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AppointmentCharts;
