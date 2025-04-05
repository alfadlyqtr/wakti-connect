
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
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProfileData } from "@/components/dashboard/home/ProfileData";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { BarChart, Activity, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const DashboardHome = () => {
  const { t } = useTranslation();
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
            <CardTitle>{t('dashboard.tasksOverview')}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <TasksOverview tasks={tasks} />
            ) : (
              <NoTasks 
                message={t('dashboard.noTasks')} 
                onCreateTask={() => navigate('/dashboard/tasks')}
              />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t('dashboard.calendar')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardCalendar 
              events={calendarEvents}
              isCompact={isMobile}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Business Analytics (only for business accounts) */}
      {isBusiness && analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t('sidebar.subscribers')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.subscriberCount}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.totalSubscribers')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t('sidebar.staff')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.staffCount}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.activeStaff')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.completionRate')}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.taskCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {t('task.completionRateThis')} {analyticsData.timeRange}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Individual Account Features */}
      {isIndividual && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('dashboard.professionalFeatures')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('dashboard.accessToFeatures')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">{t('dashboard.unlimitedTasks')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.createManage')}</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">{t('dashboard.eventManagement')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.createShare')}</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">{t('dashboard.premiumSupport')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.prioritySupport')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Free Account Upgrade Prompt */}
      {isFree && (
        <Card className="mt-6 border-2 border-dashed border-primary/40">
          <CardHeader>
            <CardTitle>{t('dashboard.upgradeExperience')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('dashboard.upgradeToUnlock')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium mb-2">{t('dashboard.individualPlan')}</h3>
                <p className="text-sm text-muted-foreground mb-2">{t('dashboard.perfectFor')}</p>
                <ul className="text-sm space-y-1">
                  <li>• {t('dashboard.unlimitedTasks')}</li>
                  <li>• {t('dashboard.createManageAppointments')}</li>
                  <li>• {t('dashboard.messageIndividuals')}</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium mb-2">{t('dashboard.businessPlan')}</h3>
                <p className="text-sm text-muted-foreground mb-2">{t('dashboard.forTeams')}</p>
                <ul className="text-sm space-y-1">
                  <li>• {t('pricing.plans.business.features.0')}</li>
                  <li>• {t('pricing.plans.business.features.1')}</li>
                  <li>• {t('pricing.plans.business.features.2')}</li>
                  <li>• {t('pricing.plans.business.features.3')}</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => navigate('/dashboard/upgrade')}
              >
                {t('dashboard.viewPlans')}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
