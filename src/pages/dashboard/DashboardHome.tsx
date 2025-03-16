
import React from "react";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProfileData } from "@/components/dashboard/home/ProfileData";
import { DashboardSummaryCards } from "@/components/dashboard/home/DashboardSummaryCards";
import { BusinessDashboardStats } from "@/components/dashboard/home/BusinessDashboardStats";
import { IndividualDashboardStats } from "@/components/dashboard/home/IndividualDashboardStats";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import CalendarLegend from "@/components/dashboard/home/CalendarLegend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const showBookingsLegend = profileData.account_type === 'business';

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

      {/* Calendar and Activity Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardCalendar />
            <CalendarLegend showBookings={showBookingsLegend} />
          </CardContent>
        </Card>

        {/* Business or Individual specific stats */}
        <div>
          {profileData.account_type === 'business' ? (
            <BusinessDashboardStats />
          ) : profileData.account_type === 'individual' ? (
            <IndividualDashboardStats />
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md">Upgrade Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Upgrade to our Individual or Business plan to unlock more features
                  including appointments, booking management, and advanced analytics.
                </p>
                <div className="mt-4">
                  <a href="/dashboard/upgrade" className="text-primary text-sm hover:underline">
                    View available plans →
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
