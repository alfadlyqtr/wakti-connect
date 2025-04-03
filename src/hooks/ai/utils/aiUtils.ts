
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
      .select('full_name, business_name, account_type')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    // Split full_name into first and last name components
    const nameParts = data?.full_name?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return { 
      firstName,
      lastName,
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
  if (lowercaseMessage.match(/check\s+(my\s+)?business|business\s+status|business\s+overview|how's\s+(my\s+)?business/i)) {
    return {
      isCommand: true,
      type: 'check_business',
      params: {}
    };
  }
  
  return {
    isCommand: false,
    type: 'none'
  };
};

// Fetch user tasks
export const getUserTasks = async (): Promise<Task[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Format tasks for AI display
export const formatTasksForDisplay = (tasks: Task[]): string => {
  if (!tasks || tasks.length === 0) {
    return "You don't have any tasks yet. Would you like me to help you create one?";
  }
  
  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  let result = `📋 **Your Tasks**\n\n`;
  
  if (pendingTasks.length > 0) {
    result += `**Pending Tasks (${pendingTasks.length})**\n`;
    pendingTasks.slice(0, 5).forEach((task, index) => {
      const dueInfo = task.due_date ? ` - Due: ${new Date(task.due_date).toLocaleDateString()}` : '';
      const priorityInfo = task.priority !== 'normal' ? ` - Priority: ${task.priority}` : '';
      result += `${index + 1}. ${task.title}${dueInfo}${priorityInfo}\n`;
    });
    
    if (pendingTasks.length > 5) {
      result += `...and ${pendingTasks.length - 5} more pending tasks.\n`;
    }
    
    result += '\n';
  }
  
  if (completedTasks.length > 0) {
    result += `**Completed Tasks (${completedTasks.length})**\n`;
    completedTasks.slice(0, 3).forEach((task, index) => {
      result += `${index + 1}. ${task.title}\n`;
    });
    
    if (completedTasks.length > 3) {
      result += `...and ${completedTasks.length - 3} more completed tasks.\n`;
    }
  }
  
  result += `\nWould you like to create a new task or see more details about a specific task?`;
  
  return result;
};

// Get upcoming events
export const getUpcomingEvents = async (): Promise<string> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    
    // Check if events table exists
    let hasEventsTable = false;
    try {
      const { count } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      hasEventsTable = count !== null;
    } catch (error) {
      console.warn('Events table may not exist yet:', error);
    }
    
    if (!hasEventsTable) {
      return "📅 The calendar and events feature is being set up. Once ready, you'll be able to schedule and manage events here.";
    }
    
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', today.toISOString())
      .lte('start_time', nextWeek.toISOString())
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    
    if (!events || events.length === 0) {
      return "📅 You don't have any upcoming events in the next 7 days. Would you like me to help you schedule an event?";
    }
    
    let result = `📅 **Your Upcoming Events**\n\n`;
    
    events.forEach((event, index) => {
      const eventDate = new Date(event.start_time).toLocaleDateString();
      const eventTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      result += `${index + 1}. **${event.title}** - ${eventDate} at ${eventTime}\n`;
      if (event.location) {
        result += `   📍 ${event.location}\n`;
      }
      if (event.description) {
        result += `   📝 ${event.description}\n`;
      }
      result += '\n';
    });
    
    result += `Would you like to schedule a new event or see more details about a specific event?`;
    
    return result;
  } catch (error) {
    console.error('Error fetching events:', error);
    return "I couldn't retrieve your calendar information at the moment. Would you like to try again?";
  }
};

// Get analytics overview
export const getAnalyticsOverview = async (): Promise<string> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    
    // Check if user is a business
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();
      
    if (profile?.account_type !== 'business') {
      // For non-business users, show productivity analytics
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
        
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
      const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return `📊 **Your Productivity Overview**

**Task Completion:** ${completionRate}% (${completedTasks}/${totalTasks})
**Pending Tasks:** ${pendingTasks}
**Completed Tasks:** ${completedTasks}

Would you like me to help you organize your pending tasks or create new ones?`;
    }
    
    // Check if business analytics table exists 
    let hasAnalyticsTable = false;
    try {
      const { count } = await supabase
        .from('business_analytics')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      hasAnalyticsTable = count !== null;
    } catch (error) {
      console.warn('Business analytics table may not exist yet:', error);
    }
    
    if (!hasAnalyticsTable) {
      return "📊 Business analytics features are being set up. Once ready, you'll be able to view detailed insights about your business performance here.";
    }
    
    // For business users, fetch business analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('business_analytics')
      .select('*')
      .eq('business_id', userId)
      .single();
      
    if (analyticsError) {
      console.error('Error fetching business analytics:', analyticsError);
      return "📊 I couldn't retrieve your business analytics at the moment. The analytics features might still be setting up. Please check back later.";
    }
    
    // Get staff data
    const { data: staff } = await supabase
      .from('business_staff')
      .select('*')
      .eq('business_id', userId)
      .eq('status', 'active');
      
    const staffCount = staff?.length || 0;
    
    // Get subscriber count
    const { data: subscribers } = await supabase
      .from('business_subscribers')
      .select('id')
      .eq('business_id', userId);
      
    const subscriberCount = subscribers?.length || 0;
    
    // Format the business analytics overview
    return `📊 **Your Business Overview**

**Subscribers:** ${analytics?.subscriber_count || subscriberCount} 
**Staff Members:** ${analytics?.staff_count || staffCount}
**Task Completion Rate:** ${analytics?.task_completion_rate || 0}%

Would you like to see more detailed analytics or specific information about your business performance?`;
  } catch (error) {
    console.error('Error generating analytics overview:', error);
    return "I couldn't retrieve your analytics information at the moment. Would you like to try again?";
  }
};

// Get business summary
export const getBusinessSummary = async (): Promise<string> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    
    // Check if user is a business
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type, business_name')
      .eq('id', userId)
      .single();
      
    if (profile?.account_type !== 'business') {
      return "This command is available for business accounts only. Would you like information about upgrading to a business plan?";
    }
    
    // Get services count
    const { data: services, error: servicesError } = await supabase
      .from('business_services')
      .select('id')
      .eq('business_id', userId);
      
    const servicesCount = services?.length || 0;
    
    // Get staff count
    const { data: staff, error: staffError } = await supabase
      .from('business_staff')
      .select('id, status')
      .eq('business_id', userId);
      
    const activeStaffCount = staff?.filter(s => s.status === 'active').length || 0;
    
    // Get bookings count (if table exists)
    let bookingsCount = 0;
    let pendingBookingsCount = 0;
    
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('business_id', userId);
        
      bookingsCount = bookings?.length || 0;
      pendingBookingsCount = bookings?.filter(b => b.status === 'pending').length || 0;
    } catch (error) {
      console.warn('Bookings table may not exist yet:', error);
    }
    
    return `🏢 **${profile?.business_name || 'Your Business'} Overview**

**Services:** ${servicesCount} services configured
**Staff:** ${activeStaffCount} active staff members
**Bookings:** ${bookingsCount} total (${pendingBookingsCount} pending)

Would you like to manage your services, staff, or bookings?`;
  } catch (error) {
    console.error('Error generating business summary:', error);
    return "I couldn't retrieve your business information at the moment. Would you like to try again?";
  }
};

// For possible future use: Interface with a business page
export const getBusinessPageStatus = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('business_pages')
      .select('is_published, page_title')
      .eq('business_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) {
      return "You don't have a business page set up yet. Would you like me to help you create one?";
    }
    
    return data.is_published 
      ? `Your business page "${data.page_title}" is published and available to visitors.` 
      : `Your business page "${data.page_title}" is created but not published yet.`;
  } catch (error) {
    console.error('Error checking business page status:', error);
    return "I couldn't check your business page status at the moment.";
  }
};
