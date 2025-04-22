
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TasksOverview from "@/components/dashboard/home/TasksOverview";
import { useTaskContext } from "@/contexts/TaskContext";
import { getUpcomingTasks } from "@/services/taskService";
import WelcomeMessage from "@/components/dashboard/home/WelcomeMessage";
import { useAuth } from "@/hooks/useAuth";
import { NoTasks } from "@/components/dashboard/home/NoTasks";
import { DashboardCalendar } from "@/components/dashboard/home/DashboardCalendar";
import { CalendarEvent } from "@/types/calendar.types";
import { Task } from "@/types/task.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { ProfileData } from "@/components/dashboard/home/ProfileData";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Activity, Users, Calendar, CheckCircle, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import RemindersOverview from "@/components/dashboard/home/RemindersOverview";
import DashboardBookingsPreview from "@/components/dashboard/home/DashboardBookingsPreview";
import BusinessAnalyticsPreview from "@/components/dashboard/home/BusinessAnalyticsPreview";

const DashboardHome = () => {
  const { tasks, isLoading: tasksLoading } = useTaskContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    profileData, 
    todayTasks, 
    unreadNotifications, 
    isLoading: dashboardDataLoading 
  } = useDashboardData();
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Business users get access to analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useBusinessAnalytics(
    profileData?.account_type === 'business' ? 'month' : undefined
  );

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        const tasks = await getUpcomingTasks();
        setUpcomingTasks(tasks);
      } catch (error) {
        console.error("Error fetching upcoming tasks:", error);
      }
    };

    fetchUpcomingTasks();
  }, []);

  // Transform tasks into calendar events
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const taskEvents = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        date: new Date(task.due_date || Date.now()),
        type: "task" as const,
        status: task.status,
        isCompleted: task.status === "completed",
        priority: task.priority
      }));

      setCalendarEvents(taskEvents);
    } else {
      setCalendarEvents([]);
    }
  }, [tasks]);

  const isLoading = tasksLoading || dashboardDataLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Determine the user's account type
  const isBusiness = profileData?.account_type === 'business';
  const isIndividual = profileData?.account_type === 'individual';
  const userRole = profileData?.account_type || 'individual';

  // Show bookings for both business and individual accounts
  const showBookings = isBusiness || isIndividual;
  // Only business accounts get analytics
  const showAnalytics = isBusiness;

  return (
    <div className="space-y-6">
      {profileData && (
        <ProfileData profileData={profileData} />
      )}
      
      {/* Summary Cards - Rich gradients and improved UI/UX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#9b87f5]/10 via-white/80 to-[#D6BCFA]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayTasks?.length || 0}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => navigate('/dashboard/tasks')}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {showBookings && (
          <Card className="bg-gradient-to-br from-[#1EAEDB]/10 via-white/80 to-[#33C3F0]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {unreadNotifications?.length || 0}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => navigate('/dashboard/bookings')}
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        )}

        {showAnalytics && (
          <Card className="bg-gradient-to-br from-[#8B5CF6]/10 via-white/80 to-[#9b87f5]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Task Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {analyticsData?.taskCompletionRate || 0}%
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => navigate('/dashboard/analytics')}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Grid - Reorganized for better layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First column - Tasks */}
        <div className="lg:col-span-1 space-y-6">
          <TasksOverview tasks={tasks} />
          
          {/* Only show reminders for non-staff users */}
          {userRole !== 'staff' && (
            <RemindersOverview userRole={userRole as any} />
          )}
        </div>
        
        {/* Second column - Calendar and Bookings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-white/80 via-white/60 to-[#E5DEFF]/20 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardCalendar 
                events={calendarEvents}
                isCompact={isMobile}
              />
            </CardContent>
          </Card>
          
          {/* Show bookings for business and individual accounts */}
          {showBookings && (
            <DashboardBookingsPreview userRole={userRole as any} />
          )}
        </div>
        
        {/* Third column - Business features / Analytics */}
        <div className="lg:col-span-1 space-y-6">
          {/* Only show business analytics for business accounts */}
          {isBusiness && (
            <BusinessAnalyticsPreview profileData={profileData} />
          )}
          
          {/* Show additional features based on account type */}
          {isBusiness ? (
            <Card className="bg-gradient-to-br from-white/80 via-white/60 to-[#E5DEFF]/20 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Staff Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium mb-2">Quick Access</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/dashboard/staff')}>
                        <Users className="h-4 w-4 mr-2" />
                        Staff List
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/dashboard/staff/schedule')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">No recent staff activity to display</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isIndividual ? (
            <Card className="bg-gradient-to-br from-white/80 via-white/60 to-[#E5DEFF]/20 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Personal Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium mb-2">Task Completion</h3>
                    <div className="text-2xl font-bold">
                      {tasks && tasks.length > 0 ? Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100) : 0}%
                    </div>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/dashboard/tasks/new')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        New Task
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/dashboard/calendar')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
