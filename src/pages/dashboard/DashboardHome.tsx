
import React from "react";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProfileData } from "@/components/dashboard/home/ProfileData";
import { DashboardSummaryCards } from "@/components/dashboard/home/DashboardSummaryCards";
import { BusinessDashboardStats } from "@/components/dashboard/home/BusinessDashboardStats";
import { IndividualDashboardStats } from "@/components/dashboard/home/IndividualDashboardStats";

const DashboardHome = () => {
  const { 
    profileData, 
    todayTasks, 
    upcomingAppointments, 
    unreadNotifications, 
    isLoading 
  } = useDashboardData();

  if (isLoading || !profileData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header with User Profile */}
      <ProfileData profileData={profileData} />
      
      {/* Main Dashboard Cards */}
      <DashboardSummaryCards 
        profileData={profileData}
        todayTasks={todayTasks || []}
        upcomingAppointments={upcomingAppointments || []}
        unreadNotifications={unreadNotifications || []}
      />

      {/* Business-specific section */}
      {profileData.account_type === 'business' && <BusinessDashboardStats />}
      
      {/* Individual-specific features */}
      {profileData.account_type === 'individual' && <IndividualDashboardStats />}
    </div>
  );
};

export default DashboardHome;
