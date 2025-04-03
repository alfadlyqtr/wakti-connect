
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/types/task.types";

// System command types and structure
export type CommandType = 'create_task' | 'view_tasks' | 'schedule_event' | 'check_calendar' | 
  'manage_staff' | 'view_analytics' | 'search_contacts' | 'view_bookings' | 'check_business' | 'none';

export interface CommandInfo {
  isCommand: boolean;
  type: CommandType;
  params?: Record<string, string>;
}

// Fetch user profile data for personalization
export const fetchUserProfile = async (userId: string): Promise<{ firstName: string; lastName: string; businessName?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, business_name, account_type')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return { 
      firstName: data?.first_name || '',
      lastName: data?.last_name || '',
      businessName: data?.business_name
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { firstName: '', lastName: '' };
  }
};

// Function to check if a message appears to be off-topic from WAKTI functionality
export const checkIfOffTopic = (message: string): boolean => {
  const waktiTopics = [
    'task', 'todo', 'schedule', 'event', 'booking', 'appointment', 
    'calendar', 'business', 'staff', 'team', 'dashboard', 'analytics', 
    'productivity', 'wakti', 'reminder', 'priority', 'due', 'deadline',
    'meeting', 'project', 'work', 'organize', 'manage'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  return !waktiTopics.some(topic => lowercaseMessage.includes(topic));
};

// Enhanced command detection for better system integration
export const detectSystemCommand = (message: string): CommandInfo => {
  const lowercaseMessage = message.toLowerCase();
  
  // Task commands
  if (lowercaseMessage.match(/create\s+(a\s+)?task|add\s+(a\s+)?task|new\s+task/i)) {
    const titleMatch = message.match(/task\s+(?:called|named|titled|:)?\s*["']?([^"']+)["']?/i) || 
                      message.match(/create\s+(?:a\s+)?task\s+(.+?)(?:\s+with|\s+due|\s+for|\s+by|\s+at|\.|$)/i);
    
    const priorityMatch = message.match(/priority\s*(?:is|:)?\s*(high|urgent|medium|normal)/i);
    const descriptionMatch = message.match(/description\s*(?:is|:)?\s*["']?([^"']+)["']?/i) || 
                            message.match(/with\s+description\s+(.+?)(?:\s+due|\s+for|\s+by|\s+at|\.|$)/i);
    const dueDateMatch = message.match(/due\s+(?:date|on)\s+(.+?)(?:\s+at|\s+with|\.|$)/i);
    
    return {
      isCommand: true,
      type: 'create_task',
      params: {
        title: titleMatch ? titleMatch[1].trim() : '',
        priority: priorityMatch ? priorityMatch[1].toLowerCase() as string : 'normal',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        dueDate: dueDateMatch ? dueDateMatch[1].trim() : ''
      }
    };
  }
  
  // View tasks command
  if (lowercaseMessage.match(/show\s+(my\s+)?tasks|view\s+(my\s+)?tasks|list\s+(my\s+)?tasks|what\s+(are\s+my|tasks\s+do\s+i\s+have)|pending\s+tasks/i)) {
    const statusMatch = message.match(/(pending|completed|all|today's|upcoming|overdue)\s+tasks/i);
    const timeframeMatch = message.match(/tasks\s+(for|due|in)\s+(today|tomorrow|this week|next week|this month)/i);
    
    return {
      isCommand: true,
      type: 'view_tasks',
      params: {
        status: statusMatch ? statusMatch[1].toLowerCase() : 'all',
        timeframe: timeframeMatch ? timeframeMatch[2].toLowerCase() : ''
      }
    };
  }
  
  // Event and calendar commands
  if (lowercaseMessage.match(/schedule\s+(an\s+)?event|create\s+(an\s+)?event|new\s+event|add\s+(an\s+)?event/i)) {
    const titleMatch = message.match(/event\s+(?:called|named|titled|:)?\s*["']?([^"']+)["']?/i) || 
                      message.match(/schedule\s+(?:an\s+)?event\s+(.+?)(?:\s+on|\s+at|\s+with|\s+for|\.|$)/i);
    
    const dateMatch = message.match(/on\s+(.+?)(?:\s+at|\s+with|\s+for|\.|$)/i);
    const timeMatch = message.match(/at\s+(.+?)(?:\s+on|\s+with|\s+for|\.|$)/i);
    const participantsMatch = message.match(/with\s+(.+?)(?:\s+on|\s+at|\s+for|\.|$)/i);
    
    return {
      isCommand: true,
      type: 'schedule_event',
      params: {
        title: titleMatch ? titleMatch[1].trim() : '',
        date: dateMatch ? dateMatch[1].trim() : '',
        time: timeMatch ? timeMatch[1].trim() : '',
        participants: participantsMatch ? participantsMatch[1].trim() : ''
      }
    };
  }
  
  if (lowercaseMessage.match(/check\s+(my\s+)?calendar|show\s+(my\s+)?calendar|what('s|\s+is)\s+(on\s+my|in\s+my)\s+calendar/i)) {
    const dateMatch = message.match(/calendar\s+for\s+(.+?)(?:\.|$)/i);
    
    return {
      isCommand: true,
      type: 'check_calendar',
      params: {
        date: dateMatch ? dateMatch[1].trim() : 'today'
      }
    };
  }
  
  // Staff management commands
  if (lowercaseMessage.match(/manage\s+staff|show\s+(my\s+)?staff|view\s+(my\s+)?team|staff\s+status|team\s+overview/i)) {
    return {
      isCommand: true,
      type: 'manage_staff',
      params: {}
    };
  }
  
  // Analytics and business dashboard commands
  if (lowercaseMessage.match(/show\s+(my\s+)?analytics|view\s+(my\s+)?dashboard|business\s+performance|sales\s+overview|revenue\s+summary/i)) {
    const periodMatch = message.match(/for\s+(today|this week|this month|last month|this year)/i);
    
    return {
      isCommand: true,
      type: 'view_analytics',
      params: {
        period: periodMatch ? periodMatch[1].toLowerCase() : 'this month'
      }
    };
  }
  
  // Contact and booking commands
  if (lowercaseMessage.match(/search\s+(for\s+)?contact|find\s+contact|lookup\s+contact/i)) {
    const nameMatch = message.match(/contact\s+(.+?)(?:\.|$)/i);
    
    return {
      isCommand: true,
      type: 'search_contacts',
      params: {
        query: nameMatch ? nameMatch[1].trim() : ''
      }
    };
  }
  
  if (lowercaseMessage.match(/view\s+(my\s+)?bookings|show\s+(my\s+)?appointments|appointment\s+overview|booking\s+summary/i)) {
    const periodMatch = message.match(/for\s+(today|tomorrow|this week|next week|this month)/i);
    
    return {
      isCommand: true,
      type: 'view_bookings',
      params: {
        period: periodMatch ? periodMatch[1].toLowerCase() : 'upcoming'
      }
    };
  }
  
  // Check business status
  if (lowercaseMessage.match(/check\s+(my\s+)?business|business\s+status|business\s+overview|business\s+summary/i)) {
    return {
      isCommand: true,
      type: 'check_business',
      params: {}
    };
  }
  
  // Not a recognized command
  return {
    isCommand: false,
    type: 'none',
    params: {}
  };
};

// Function to get user tasks from the database
export const getUserTasks = async (): Promise<Task[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to view tasks");
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast({
      title: "Error fetching tasks",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Format tasks for display in AI assistant
export const formatTasksForDisplay = (tasks: Task[]): string => {
  if (tasks.length === 0) {
    return "You don't have any tasks currently.";
  }
  
  const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  let message = "📋 **Your Tasks**\n\n";
  
  if (pendingTasks.length > 0) {
    message += "**Pending Tasks:**\n";
    pendingTasks.slice(0, 5).forEach((task, index) => {
      const priority = task.priority === 'urgent' ? '🔴' : task.priority === 'high' ? '🟠' : task.priority === 'medium' ? '🟡' : '🟢';
      message += `${index + 1}. ${priority} ${task.title}${task.due_date ? ` - Due: ${new Date(task.due_date).toLocaleDateString()}` : ''}\n`;
    });
    
    if (pendingTasks.length > 5) {
      message += `...and ${pendingTasks.length - 5} more pending tasks.\n`;
    }
    
    message += "\n";
  }
  
  if (completedTasks.length > 0) {
    message += "**Recently Completed:**\n";
    completedTasks.slice(0, 3).forEach((task, index) => {
      message += `${index + 1}. ✅ ${task.title}\n`;
    });
    
    if (completedTasks.length > 3) {
      message += `...and ${completedTasks.length - 3} more completed tasks.\n`;
    }
  }
  
  return message;
};

// Get analytics overview from database
export const getAnalyticsOverview = async (): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to view analytics");
    }
    
    // Task analytics
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('status, priority, created_at')
      .eq('user_id', session.user.id);
      
    if (tasksError) throw tasksError;
    
    // Get event analytics if events table exists
    let events = [];
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('status, start_time')
        .eq('user_id', session.user.id);
        
      if (!eventsError) {
        events = eventsData || [];
      }
    } catch (error) {
      console.warn("Events table might not exist yet:", error);
    }
    
    // Format analytics data
    const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    const highPriorityCount = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
    
    // Calculate task completion rate
    const completionRate = tasks.length > 0 
      ? Math.round((completedTasksCount / tasks.length) * 100) 
      : 0;
    
    // Format upcoming events if any
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingEvents = events.filter(e => {
      const eventDate = new Date(e.start_time);
      return eventDate >= today && eventDate <= nextWeek;
    });
    
    // Create analytics message
    let message = "📊 **Analytics Overview**\n\n";
    message += `**Task Summary:**\n`;
    message += `- Pending tasks: ${pendingTasksCount}\n`;
    message += `- Completed tasks: ${completedTasksCount}\n`;
    message += `- High priority items: ${highPriorityCount}\n`;
    message += `- Task completion rate: ${completionRate}%\n\n`;
    
    if (upcomingEvents.length > 0) {
      message += `**Upcoming Events:**\n`;
      message += `- Next 7 days: ${upcomingEvents.length} events\n\n`;
    }
    
    message += `This is a simplified overview. Would you like more detailed analytics on specific areas?`;
    
    return message;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return "I couldn't retrieve your analytics data at this moment. Please try again later.";
  }
};

// Get upcoming events from database
export const getUpcomingEvents = async (): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to view events");
    }
    
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('title, start_time, end_time, location, is_all_day')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (eventsError) throw eventsError;
      
      if (!events || events.length === 0) {
        return "You don't have any upcoming events scheduled.";
      }
      
      let message = "📅 **Your Upcoming Events**\n\n";
      
      events.forEach((event, index) => {
        const eventDate = new Date(event.start_time);
        const formattedDate = eventDate.toLocaleDateString();
        const formattedTime = event.is_all_day 
          ? "All day" 
          : `${new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        message += `${index + 1}. **${event.title}**\n`;
        message += `   📆 ${formattedDate} | ⏰ ${formattedTime}\n`;
        
        if (event.location) {
          message += `   📍 ${event.location}\n`;
        }
        
        message += "\n";
      });
      
      return message;
    } catch (error) {
      console.warn("Events table might not exist yet:", error);
      return "The events feature is still being set up. Would you like me to help you schedule an event once it's ready?";
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return "I couldn't retrieve your events at this moment. Please try again later.";
  }
};

// Get business dashboard summary
export const getBusinessSummary = async (): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to view business data");
    }
    
    // Check if user has a business profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type, business_name')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    if (profile.account_type !== 'business') {
      return "You don't currently have a business account. Would you like information about upgrading to access business features?";
    }
    
    // Try to get staff count
    let staffCount = 0;
    try {
      const { count, error: staffError } = await supabase
        .from('staff_relations')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (!staffError) {
        staffCount = count || 0;
      }
    } catch (error) {
      console.warn("Staff relations table might not exist yet:", error);
    }
    
    // Try to get customer/subscriber count
    let subscriberCount = 0;
    try {
      const { count, error: subscriberError } = await supabase
        .from('business_subscribers')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (!subscriberError) {
        subscriberCount = count || 0;
      }
    } catch (error) {
      console.warn("Business subscribers table might not exist yet:", error);
    }
    
    // Get recent job cards if they exist
    let recentJobCards = [];
    try {
      const { data: jobCards, error: jobCardsError } = await supabase
        .from('job_cards')
        .select('created_at, amount')
        .eq('business_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (!jobCardsError) {
        recentJobCards = jobCards || [];
      }
    } catch (error) {
      console.warn("Job cards table might not exist yet:", error);
    }
    
    // Calculate total revenue from job cards
    const totalRevenue = recentJobCards.reduce((sum, card) => sum + (card.amount || 0), 0);
    
    // Format business summary
    let message = `💼 **Business Dashboard: ${profile.business_name || 'Your Business'}**\n\n`;
    
    message += `**Quick Stats:**\n`;
    message += `- Staff members: ${staffCount}\n`;
    message += `- Subscribers/Customers: ${subscriberCount}\n`;
    
    if (recentJobCards.length > 0) {
      message += `- Recent job cards: ${recentJobCards.length}\n`;
      message += `- Revenue from recent jobs: ${totalRevenue.toFixed(2)}\n\n`;
    }
    
    message += `Would you like more detailed information about specific aspects of your business?`;
    
    return message;
  } catch (error) {
    console.error("Error fetching business summary:", error);
    return "I couldn't retrieve your business data at this moment. Please try again later.";
  }
};
