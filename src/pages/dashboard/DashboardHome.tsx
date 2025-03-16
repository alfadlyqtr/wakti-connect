
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Building, UserCircle, Crown, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/ui/section-heading";

interface ProfileData {
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
  theme_preference: string | null;
}

const DashboardHome = () => {
  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, account_type, display_name, business_name, occupation, avatar_url, theme_preference')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data as ProfileData;
    },
  });

  // Fetch today's tasks
  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['todayTasks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('due_date', startOfDay.toISOString())
        .lte('due_date', endOfDay.toISOString());
      
      if (error) {
        console.error("Error fetching today's tasks:", error);
        throw error;
      }
      
      return data;
    },
  });

  // Fetch upcoming appointments
  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get current time
      const now = new Date();
      
      // Get future appointments (next 7 days)
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', now.toISOString())
        .lte('start_time', sevenDaysLater.toISOString())
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error("Error fetching upcoming appointments:", error);
        throw error;
      }
      
      return data;
    },
  });

  // Fetch unread notifications count
  const { data: unreadNotifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error("Error fetching unread notifications:", error);
        throw error;
      }
      
      return data;
    },
  });

  // Get display name for welcome message
  const getDisplayName = () => {
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.full_name) return profileData.full_name;
    return '';
  };

  // Get account specific welcome title
  const getWelcomeTitle = () => {
    switch (profileData?.account_type) {
      case 'business':
        return 'Business Dashboard';
      case 'individual':
        return 'Professional Dashboard';
      default:
        return 'Personal Dashboard';
    }
  };

  const getAccountIcon = () => {
    switch (profileData?.account_type) {
      case 'business':
        return <Building className="text-green-500 h-6 w-6" />;
      case 'individual':
        return <Briefcase className="text-wakti-blue h-6 w-6" />;
      default:
        return <UserCircle className="text-wakti-gold h-6 w-6" />;
    }
  };

  const isLoading = profileLoading || tasksLoading || appointmentsLoading || notificationsLoading;

  if (isLoading) {
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
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {getWelcomeTitle()}
          </h1>
          <p className="text-muted-foreground">
            Welcome back{getDisplayName() ? `, ${getDisplayName()}` : ''}!
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-card rounded-lg border shadow-sm">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileData?.avatar_url || undefined} alt="Profile" />
            <AvatarFallback className="bg-primary/10">
              {getDisplayName()?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center">
              {getAccountIcon()}
              <span className="ml-1 text-sm font-medium capitalize">
                {profileData?.account_type || 'Free'} Account
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {profileData?.business_name ? `${profileData.business_name}` : 
               profileData?.occupation ? `${profileData.occupation}` : 'Personal User'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Type
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {profileData?.account_type || "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profileData?.account_type === 'free' ? 'Upgrade for more features!' : 
               profileData?.account_type === 'individual' ? 'Personal plan with extended features' : 
               'Full access to all business features'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Tasks
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {todayTasks?.length 
                ? `${todayTasks.length} tasks due today` 
                : "No tasks scheduled for today"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 18V6m0 12 3-3m-3 3-3-3M8 6v12m0-12L5 9m3-3 3 3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments?.length
                ? `Next: ${format(new Date(upcomingAppointments[0].start_time), 'MMM d, h:mm a')}`
                : "No upcoming appointments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Notifications
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {unreadNotifications?.length
                ? `${unreadNotifications.length} unread notifications`
                : "No unread notifications"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Business-specific section */}
      {profileData?.account_type === 'business' && (
        <>
          <SectionHeading 
            title="Business Analytics" 
            centered={false}
            className="mt-8 mb-4"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Total business subscribers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Staff members in your team
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Business services offered
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Individual-specific features */}
      {profileData?.account_type === 'individual' && (
        <>
          <SectionHeading 
            title="My Productivity" 
            centered={false}
            className="mt-8 mb-4"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Tasks completed this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  People in your network
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
