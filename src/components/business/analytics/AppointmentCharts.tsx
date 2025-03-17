
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Sample data for demonstration
const appointmentData = [
  { month: 'Jan', Scheduled: 12, Completed: 10, Cancelled: 2 },
  { month: 'Feb', Scheduled: 19, Completed: 15, Cancelled: 4 },
  { month: 'Mar', Scheduled: 15, Completed: 13, Cancelled: 2 },
  { month: 'Apr', Scheduled: 25, Completed: 20, Cancelled: 5 },
  { month: 'May', Scheduled: 22, Completed: 18, Cancelled: 4 },
  { month: 'Jun', Scheduled: 30, Completed: 25, Cancelled: 5 },
];

export const AppointmentCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Scheduled" fill="#3b82f6" />
              <Bar dataKey="Completed" fill="#22c55e" />
              <Bar dataKey="Cancelled" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCharts;
