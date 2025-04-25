
import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardHome: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  const renderDashboardContent = (role: UserRole) => {
    // Business dashboard
    if (role === 'business' || role === 'superadmin') {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Business Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Welcome to your business dashboard</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No recent bookings found</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No services data available</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Staff dashboard
    if (role === 'staff') {
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your upcoming appointments will appear here</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have no pending tasks</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Individual dashboard (default)
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No tasks found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No upcoming events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No recent activity</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {renderDashboardContent(userRole)}
    </div>
  );
};

export default DashboardHome;
