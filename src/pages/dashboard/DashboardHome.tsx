
import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  const renderDashboardContent = (role: UserRole) => {
    // Business dashboard
    if (role === 'business' || role === 'superadmin') {
      return (
        <Card className="p-4">
          <h2>Business Dashboard</h2>
          <p>Business dashboard content coming soon...</p>
        </Card>
      );
    }
    
    // Staff dashboard
    if (role === 'staff') {
      return (
        <Card className="p-4">
          <h2>Staff Dashboard</h2>
          <p>Staff dashboard content coming soon...</p>
        </Card>
      );
    }
    
    // Individual dashboard (default)
    return (
      <Card className="p-4">
        <h2>Individual Dashboard</h2>
        <p>Individual dashboard content coming soon...</p>
      </Card>
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
