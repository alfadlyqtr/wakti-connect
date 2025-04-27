
import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardSummaryCards from "@/components/dashboard/home/DashboardSummaryCards";
import DashboardTasks from "@/components/dashboard/home/DashboardTasks";
import DashboardProfile from "@/components/dashboard/home/DashboardProfile";
import DashboardReminders from "@/components/dashboard/home/DashboardReminders";
import DashboardBookings from "@/components/dashboard/home/DashboardBookings";
import DashboardAnalytics from "@/components/dashboard/home/DashboardAnalytics";
import DashboardEvents from "@/components/dashboard/home/DashboardEvents";
import { DashboardWidgetLayout } from "@/types/dashboard";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { Loader2 } from "lucide-react";

const DashboardHome = () => {
  const {
    profileData,
    todayTasks,
    unreadNotifications,
    isLoading,
  } = useDashboardData();

  const { layout, setLayout } = useDashboardLayout();

  const handleWidgetOrderChange = (newLayout: DashboardWidgetLayout[]) => {
    setLayout(newLayout);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardSummaryCards
        profileData={profileData}
        todayTasks={todayTasks}
        unreadNotifications={unreadNotifications}
        isLoading={isLoading}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardTasks tasks={todayTasks} />
        <DashboardReminders />
        <DashboardBookings />
        <DashboardAnalytics />
        <DashboardEvents />
        <DashboardProfile profileData={profileData} />
      </div>
    </div>
  );
};

export default DashboardHome;
