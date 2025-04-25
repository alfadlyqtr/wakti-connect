
import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import StatsCards from '@/components/dashboard/home/StatsCards';
import DashboardTasksPreview from '@/components/dashboard/home/DashboardTasksPreview';
import DashboardEventsPreview from '@/components/dashboard/home/DashboardEventsPreview';
import DashboardBookingsPreview from '@/components/dashboard/home/DashboardBookingsPreview';
import DashboardServicesPreview from '@/components/dashboard/home/DashboardServicesPreview';
import DashboardUpcomingBookingsPreview from '@/components/dashboard/home/DashboardUpcomingBookingsPreview';
import DashboardStaffPreview from '@/components/dashboard/home/DashboardStaffPreview';
import DashboardActivityStreamPreview from '@/components/dashboard/home/DashboardActivityStreamPreview';
import { UserRole } from '@/types/user';

const DashboardHome: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  const renderDashboardContent = (role: UserRole) => {
    // Business dashboard
    if (role === 'business' || role === 'superadmin') {
      return (
        <>
          <StatsCards variant="business" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DashboardTasksPreview userRole={role} />
            <DashboardEventsPreview userRole={role} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DashboardBookingsPreview userRole={role} />
            <DashboardServicesPreview />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DashboardStaffPreview />
            <DashboardActivityStreamPreview />
          </div>
        </>
      );
    }
    
    // Staff dashboard
    if (role === 'staff') {
      return (
        <>
          <StatsCards variant="staff" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DashboardTasksPreview userRole={role} />
            <DashboardEventsPreview userRole={role} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            <DashboardUpcomingBookingsPreview />
          </div>
        </>
      );
    }
    
    // Individual dashboard (default)
    return (
      <>
        <StatsCards variant="individual" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <DashboardTasksPreview userRole={role} />
          <DashboardEventsPreview userRole={role} />
        </div>
        
        <div className="grid grid-cols-1 mt-6">
          <DashboardActivityStreamPreview />
        </div>
      </>
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
