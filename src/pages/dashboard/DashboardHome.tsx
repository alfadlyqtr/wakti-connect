
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { UserRole } from "@/types/user";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import { CalendarEvent } from "@/types/calendar.types";
import RemindersOverview from "@/components/dashboard/home/RemindersOverview";
import DashboardBookingsPreview from "@/components/dashboard/home/DashboardBookingsPreview";
import BusinessAnalyticsPreview from "@/components/dashboard/home/BusinessAnalyticsPreview";
import TasksOverview from "@/components/dashboard/home/TasksOverview";

// Sample calendar events data
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2025, 3, 23, 10, 0),
    type: "booking",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Client Call",
    date: new Date(2025, 3, 24, 15, 30),
    type: "booking",
    status: "confirmed",
  },
  {
    id: "3",
    title: "Project Deadline",
    date: new Date(2025, 3, 25, 17, 0),
    type: "task",
    status: "pending",
  },
  {
    id: "4",
    title: "Today's Task",
    date: new Date(),
    type: "task",
    status: "pending",
  },
];

const DashboardHome: React.FC = () => {
  const { profileData, userRole } = useDashboardUserProfile();
  
  // Early loading state
  if (!profileData) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Determine if role is business, handling super-admin as business
  const isBusinessAccount = userRole === 'business' || userRole === 'super-admin';
  
  // Determine if role is staff, using explicit equality check
  const isStaffAccount = userRole === 'staff';
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tasks Overview Card - For all users */}
        <TasksOverview userRole={userRole} />
        
        {/* Reminders Card - For all users */}
        <RemindersOverview userRole={userRole} />
        
        {/* Bookings Preview - For all paid users */}
        <DashboardBookingsPreview userRole={userRole} />
        
        {/* Calendar Card - Full column width for better visibility */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardCalendar events={sampleEvents} />
            </CardContent>
          </Card>
        </div>
        
        {/* Business Analytics Preview - Only for business accounts */}
        {isBusinessAccount && (
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <BusinessAnalyticsPreview 
              profileData={{
                account_type: profileData.account_type as "individual" | "business",
                business_name: profileData.business_name || undefined
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
