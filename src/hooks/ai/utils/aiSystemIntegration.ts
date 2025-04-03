
import { supabase } from "@/integrations/supabase/client";

// This is a simplified version to fix TypeScript errors
export async function getSystemIntegrationData(userId: string) {
  try {
    // Get tasks stats
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title, status, priority, due_date')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (tasksError) throw tasksError;
    
    const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
    const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
    
    // Try to get upcoming events
    let upcomingEvents = [];
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, start_time, end_time')
        .eq('user_id', userId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (!eventsError) {
        upcomingEvents = events || [];
      }
    } catch (error) {
      console.warn("Error getting events:", error);
    }
    
    // Get user profile info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type, full_name, business_name')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    // Check if user is a business owner
    const isBusinessOwner = profile?.account_type === 'business';
    
    // Business-specific data
    let businessData = null;
    if (isBusinessOwner) {
      try {
        // Get staff count
        const { count: staffCount } = await supabase
          .from('business_staff')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', userId)
          .eq('status', 'active');
          
        // Get service count
        const { count: serviceCount } = await supabase
          .from('business_services')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', userId);
          
        businessData = {
          staffCount: staffCount || 0,
          serviceCount: serviceCount || 0
        };
      } catch (error) {
        console.warn("Error getting business data:", error);
      }
    }
    
    // Return aggregated system data
    return {
      tasks: {
        pending: pendingTasks,
        completed: completedTasks,
        totalPending: pendingTasks.length,
        totalCompleted: completedTasks.length,
        completionRate: tasks && tasks.length > 0 ? 
          Math.round((completedTasks.length / tasks.length) * 100) : 0
      },
      events: {
        upcoming: upcomingEvents,
        totalUpcoming: upcomingEvents.length
      },
      user: {
        accountType: profile?.account_type || 'free',
        name: profile?.full_name,
        businessName: profile?.business_name
      },
      business: businessData
    };
  } catch (error) {
    console.error("Error getting system integration data:", error);
    return null;
  }
}

// Function to format the system data for AI consumption
export function formatSystemContext(systemData: any): string {
  if (!systemData) return '';
  
  let context = '### SYSTEM CONTEXT ###\n';
  
  // Add user info
  context += `User: ${systemData.user.name || 'Unknown'}\n`;
  context += `Account type: ${systemData.user.accountType}\n`;
  if (systemData.user.businessName) {
    context += `Business name: ${systemData.user.businessName}\n`;
  }
  
  // Add task stats
  context += `\nTasks:\n`;
  context += `- Pending tasks: ${systemData.tasks.totalPending}\n`;
  context += `- Completed tasks: ${systemData.tasks.totalCompleted}\n`;
  context += `- Task completion rate: ${systemData.tasks.completionRate}%\n`;
  
  // Add upcoming events
  context += `\nEvents:\n`;
  context += `- Upcoming events: ${systemData.events.totalUpcoming}\n`;
  
  // Add business info if applicable
  if (systemData.business) {
    context += `\nBusiness info:\n`;
    context += `- Staff members: ${systemData.business.staffCount}\n`;
    context += `- Services: ${systemData.business.serviceCount}\n`;
  }
  
  context += '### END SYSTEM CONTEXT ###\n';
  
  return context;
}

// Get a single task by ID
export async function getTaskById(taskId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting task:", error);
    return null;
  }
}

// Simple function to check staff permissions
export async function checkStaffPermissions(userId: string, businessId: string) {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions, role')
      .eq('staff_id', userId)
      .eq('business_id', businessId)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error checking staff permissions:", error);
    return null;
  }
}
