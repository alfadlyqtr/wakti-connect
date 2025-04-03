
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Function to get user task statistics for AI insights
export const getTaskStatistics = async (userId: string) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('tasks')
      .select('id, status, priority, created_at, completed_at, due_date')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Calculate task statistics
    const totalTasks = data.length;
    const pendingTasks = data.filter(t => t.status === 'pending').length;
    const completedTasks = data.filter(t => t.status === 'completed').length;
    const inProgressTasks = data.filter(t => t.status === 'in-progress').length;
    
    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;
    
    // Calculate tasks created this month
    const tasksThisMonth = data.filter(t => {
      const createdAt = new Date(t.created_at);
      return createdAt >= startOfMonth;
    }).length;
    
    // Calculate tasks completed this month
    const completedThisMonth = data.filter(t => {
      const completedAt = t.completed_at ? new Date(t.completed_at) : null;
      return completedAt && completedAt >= startOfMonth;
    }).length;
    
    // Identify overdue tasks
    const now = new Date();
    const overdueTasks = data.filter(t => {
      if (t.status === 'completed' || !t.due_date) return false;
      const dueDate = new Date(t.due_date);
      return dueDate < now;
    }).length;
    
    // Calculate average completion time for completed tasks
    let totalCompletionTime = 0;
    let tasksWithCompletionTime = 0;
    
    data.forEach(t => {
      if (t.status === 'completed' && t.created_at && t.completed_at) {
        const created = new Date(t.created_at).getTime();
        const completed = new Date(t.completed_at).getTime();
        const completionTime = completed - created;
        
        if (completionTime > 0) {
          totalCompletionTime += completionTime;
          tasksWithCompletionTime++;
        }
      }
    });
    
    const avgCompletionTimeMs = tasksWithCompletionTime > 0 ? 
      totalCompletionTime / tasksWithCompletionTime : 0;
    
    // Convert to hours
    const avgCompletionTimeHours = (avgCompletionTimeMs / (1000 * 60 * 60)).toFixed(1);
    
    return {
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      tasksThisMonth,
      completedThisMonth,
      overdueTasks,
      avgCompletionTimeHours
    };
  } catch (error) {
    console.error("Error getting task statistics:", error);
    return null;
  }
};

// Function to get productivity insights for AI recommendations
export const getProductivityInsights = async (userId: string) => {
  try {
    const stats = await getTaskStatistics(userId);
    if (!stats) return null;
    
    const insights = [];
    
    // Task backlog insights
    if (stats.pendingTasks > 10) {
      insights.push({
        type: 'backlog',
        severity: 'high',
        message: `You have ${stats.pendingTasks} pending tasks. Consider prioritizing or rescheduling some of them.`
      });
    } else if (stats.pendingTasks > 5) {
      insights.push({
        type: 'backlog',
        severity: 'medium',
        message: `You have ${stats.pendingTasks} pending tasks. Make sure they're properly prioritized.`
      });
    }
    
    // Completion rate insights
    if (parseFloat(stats.completionRate) < 30) {
      insights.push({
        type: 'completion_rate',
        severity: 'high',
        message: `Your task completion rate is ${stats.completionRate}%. Try breaking down tasks into smaller, more manageable items.`
      });
    } else if (parseFloat(stats.completionRate) < 50) {
      insights.push({
        type: 'completion_rate',
        severity: 'medium',
        message: `Your task completion rate is ${stats.completionRate}%. Consider reviewing your task management strategy.`
      });
    } else if (parseFloat(stats.completionRate) > 80) {
      insights.push({
        type: 'completion_rate',
        severity: 'positive',
        message: `Great job! Your task completion rate is ${stats.completionRate}%.`
      });
    }
    
    // Overdue tasks insights
    if (stats.overdueTasks > 5) {
      insights.push({
        type: 'overdue',
        severity: 'high',
        message: `You have ${stats.overdueTasks} overdue tasks. Consider rescheduling or reprioritizing them.`
      });
    } else if (stats.overdueTasks > 0) {
      insights.push({
        type: 'overdue',
        severity: 'medium',
        message: `You have ${stats.overdueTasks} overdue ${stats.overdueTasks === 1 ? 'task' : 'tasks'}. Try to address ${stats.overdueTasks === 1 ? 'it' : 'them'} soon.`
      });
    }
    
    // Monthly activity insights
    if (stats.tasksThisMonth > 20) {
      insights.push({
        type: 'activity',
        severity: 'positive',
        message: `You've created ${stats.tasksThisMonth} tasks this month - that's impressive activity!`
      });
    }
    
    if (stats.completedThisMonth > 15) {
      insights.push({
        type: 'activity',
        severity: 'positive',
        message: `You've completed ${stats.completedThisMonth} tasks this month - great productivity!`
      });
    }
    
    return {
      stats,
      insights
    };
  } catch (error) {
    console.error("Error getting productivity insights:", error);
    return null;
  }
};

// Function to get upcoming events for calendar management
export const getUpcomingCalendarEvents = async (userId: string, days: number = 7) => {
  try {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + days);
    
    // Check if events table exists before querying
    const { count, error: checkError } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .limit(1);
      
    if (checkError) {
      console.error("Events table might not exist:", checkError);
      return null;
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', now.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    return null;
  }
};

// Function to get business insights for owners
export const getBusinessInsights = async (userId: string) => {
  try {
    // Check if user is a business owner
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type, business_name')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    if (profile.account_type !== 'business') {
      return { isBusiness: false };
    }
    
    // Get staff count
    const { count: staffCount, error: staffError } = await supabase
      .from('staff_relations')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', userId);
      
    if (staffError) {
      console.warn("Staff relations table might not exist:", staffError);
    }
    
    // Get recent job cards if available
    let recentJobCards = [];
    const { data: jobCards, error: jobCardsError } = await supabase
      .from('job_cards')
      .select('created_at, amount')
      .eq('business_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (jobCardsError) {
      console.warn("Job cards table might not exist:", jobCardsError);
    } else {
      recentJobCards = jobCards || [];
    }
    
    // Calculate total revenue
    const totalRevenue = recentJobCards.reduce((sum, card) => sum + (card.amount || 0), 0);
    
    return {
      isBusiness: true,
      businessName: profile.business_name,
      staffCount: staffCount || 0,
      recentJobCards: recentJobCards.length,
      totalRevenue
    };
  } catch (error) {
    console.error("Error getting business insights:", error);
    return { isBusiness: false };
  }
};
