
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
import { DashboardSummaryCards } from "@/components/dashboard/home/DashboardSummaryCards";
import { ProfileData } from "@/components/dashboard/home/ProfileData";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BarChart, Activity, Users } from "lucide-react";

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

  // Determine if the user has a business account
  const isBusiness = profileData?.account_type === 'business';
  const isIndividual = profileData?.account_type === 'individual';
  const isFree = profileData?.account_type === 'free';

  return (
    <div className="space-y-6">
      {profileData && (
        <ProfileData profileData={profileData} />
      )}
      
      {/* Summary Cards Section */}
      {profileData && todayTasks && unreadNotifications && (
        <DashboardSummaryCards 
          profileData={profileData}
          todayTasks={todayTasks || []}
          unreadNotifications={unreadNotifications || []}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <TasksOverview tasks={tasks} />
            ) : (
              <NoTasks 
                message="You have no tasks yet. Create a new task to get started." 
                onCreateTask={() => navigate('/dashboard/tasks')}
              />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardCalendar 
              events={calendarEvents}
              isCompact={isMobile}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Business Analytics (only for business accounts with data) */}
      {isBusiness && analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.subscriberCount || "-"}</div>
              <p className="text-xs text-muted-foreground">
                Total Subscribers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Staff
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.staffCount || "-"}</div>
              <p className="text-xs text-muted-foreground">
                Active Staff Members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.taskCompletionRate ? `${analyticsData.taskCompletionRate}%` : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Task completion rate this {analyticsData.timeRange}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Individual Account Features */}
      {isIndividual && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Professional Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access to these professional features
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Unlimited Tasks</h3>
                <p className="text-sm text-muted-foreground">Create and manage unlimited tasks</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Event Management</h3>
                <p className="text-sm text-muted-foreground">Create and share events</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Premium Support</h3>
                <p className="text-sm text-muted-foreground">Priority support access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Free Account Upgrade Prompt */}
      {isFree && (
        <Card className="mt-6 border-2 border-dashed border-primary/40">
          <CardHeader>
            <CardTitle>Upgrade Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upgrade to unlock premium features
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium mb-2">Individual Plan</h3>
                <p className="text-sm text-muted-foreground mb-2">Perfect for personal productivity</p>
                <ul className="text-sm space-y-1">
                  <li>• Unlimited Tasks</li>
                  <li>• Create and manage appointments</li>
                  <li>• Message individual users</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium mb-2">Business Plan</h3>
                <p className="text-sm text-muted-foreground mb-2">For teams and businesses</p>
                <ul className="text-sm space-y-1">
                  <li>• Custom Business Profile</li>
                  <li>• Staff Management</li>
                  <li>• Booking System</li>
                  <li>• AI Chatbot Integration</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => navigate('/dashboard/upgrade')}
              >
                View Plans
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
