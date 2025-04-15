
import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { getUpcomingTasks } from "@/services/taskService";
import { useAuth } from "@/hooks/useAuth";
import { Task } from "@/types/task.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { useDashboardData } from "@/hooks/useDashboardData";
import AppleStyleDashboard from "@/components/dashboard/AppleStyleDashboard";
import { UserRole } from "@/types/user";

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

  const isLoading = tasksLoading || dashboardDataLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Determine the user's role
  const getUserRole = (): UserRole => {
    if (localStorage.getItem('isSuperAdmin') === 'true') {
      return 'super-admin';
    }
    
    if (localStorage.getItem('userRole') === 'staff') {
      return 'staff';
    }
    
    return (profileData?.account_type as UserRole) || 'free';
  };

  return (
    <AppleStyleDashboard userRole={getUserRole()} />
  );
};

export default DashboardHome;
