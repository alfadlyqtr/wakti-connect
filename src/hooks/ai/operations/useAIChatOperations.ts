
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAIMessages } from "../messages/useAIMessages";
import { callAIAssistant } from "../utils/callAIAssistant";
import { 
  checkIfOffTopic, 
  detectSystemCommand,
  getUserTasks,
  formatTasksForDisplay,
  getAnalyticsOverview,
  getUpcomingEvents,
  getBusinessSummary,
  CommandType
} from "../utils/aiUtils";
import { toast } from "@/components/ui/use-toast";
import { useTaskContext } from "@/contexts/TaskContext";

// Helper function to parse dates from natural language
const parseNaturalDate = (dateString: string): Date | null => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Handle common date expressions
  if (!dateString || dateString.toLowerCase() === 'today') {
    return today;
  } else if (dateString.toLowerCase() === 'tomorrow') {
    return tomorrow;
  } else if (dateString.toLowerCase().includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek;
  } else {
    // Try to parse the date string
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
  }
  
  return null;
};

export const useAIChatOperations = (userId?: string, userName: string = "") => {
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    addSystemMessage,
    clearMessages
  } = useAIMessages(userName);
  
  const [offTopicCount, setOffTopicCount] = useState(0);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const taskContext = useTaskContext();

  // Handle system commands with enhanced functionality
  const handleSystemCommand = async (message: string): Promise<boolean> => {
    const commandInfo = detectSystemCommand(message);
    
    if (!commandInfo.isCommand) {
      return false;
    }
    
    setIsProcessingCommand(true);
    
    try {
      const commandType: CommandType = commandInfo.type;
      
      switch (commandType) {
        case 'create_task':
          if (commandInfo.params?.title) {
            // Create task using the TaskContext
            await taskContext.addTask({
              title: commandInfo.params.title,
              description: commandInfo.params.description || "",
              priority: (commandInfo.params.priority as any) || "normal",
              status: "pending",
              user_id: userId || "",
              created_at: new Date().toISOString(),
              // Set due date if provided
              ...(commandInfo.params.dueDate && { 
                due_date: parseNaturalDate(commandInfo.params.dueDate)?.toISOString() 
              }),
            });
            
            addSystemMessage(`✅ Task created: "${commandInfo.params.title}"`);
            return true;
          }
          addSystemMessage(`❓ I need a task title. Try saying "Create a task called [task name]".`);
          return true;
          
        case 'view_tasks':
          // Fetch tasks using the task service
          const tasks = await getUserTasks();
          const formattedTasks = formatTasksForDisplay(tasks);
          addSystemMessage(formattedTasks);
          return true;
          
        case 'schedule_event':
          if (commandInfo.params?.title) {
            // Check if events feature is available
            const { count, error: tableError } = await supabase
              .from('events')
              .select('id', { count: 'exact', head: true })
              .limit(1);
              
            if (tableError) {
              // Table doesn't exist yet
              addSystemMessage(`📅 I'll help you schedule an event: "${commandInfo.params.title}". 
              
The events feature is being set up. In the meantime, you can create events from the Events section in your dashboard.`);
              return true;
            }
            
            // TODO: Implement complete event creation functionality
            // For now we just acknowledge the intent
            let responseMessage = `📅 I'll help you schedule an event: "${commandInfo.params.title}"`;
            
            if (commandInfo.params.date) {
              responseMessage += ` on ${commandInfo.params.date}`;
            }
            
            if (commandInfo.params.time) {
              responseMessage += ` at ${commandInfo.params.time}`;
            }
            
            if (commandInfo.params.participants) {
              responseMessage += ` with ${commandInfo.params.participants}`;
            }
            
            addSystemMessage(`${responseMessage}
            
Would you like to add more details to this event?`);
            return true;
          }
          addSystemMessage(`❓ I need an event title. Try saying "Schedule an event called [event name]".`);
          return true;
          
        case 'check_calendar':
          // Get upcoming events
          const eventsMessage = await getUpcomingEvents();
          addSystemMessage(eventsMessage);
          return true;
          
        case 'manage_staff':
          // Check if user is a business owner
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', userId)
            .single();
            
          if (profileError || profile?.account_type !== 'business') {
            addSystemMessage(`👥 Staff management is available for Business accounts only. Would you like information about upgrading to a Business plan?`);
            return true;
          }
          
          // For now, just provide a link to the staff management page
          addSystemMessage(`👥 You can manage your staff members in the Staff Management section of your dashboard. Would you like me to explain how to set up staff permissions?`);
          return true;
          
        case 'view_analytics':
          // Get analytics overview
          const analyticsMessage = await getAnalyticsOverview();
          addSystemMessage(analyticsMessage);
          return true;
          
        case 'search_contacts':
          if (!commandInfo.params?.query) {
            addSystemMessage(`👥 Please specify who you're looking for. Try saying "Search for contact [name]".`);
            return true;
          }
          
          // Simple acknowledgement for now
          // TODO: Implement actual contact search
          addSystemMessage(`👥 I'm searching for contacts matching "${commandInfo.params.query}". This feature is being implemented and will be available soon.`);
          return true;
          
        case 'view_bookings':
          // Simple acknowledgement for now
          // TODO: Implement booking overview
          const periodText = commandInfo.params?.period || "upcoming";
          addSystemMessage(`📒 I'm retrieving your ${periodText} bookings. This feature is being implemented and will be available soon.`);
          return true;
          
        case 'check_business':
          // Get business summary
          const businessSummary = await getBusinessSummary();
          addSystemMessage(businessSummary);
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error("Error processing system command:", error);
      addErrorMessage(error);
      return false;
    } finally {
      setIsProcessingCommand(false);
    }
  };

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Add user message to the list
      addUserMessage(message);
      
      // Check if this is a system command first
      const isHandled = await handleSystemCommand(message);
      if (isHandled) {
        return { response: "Command processed successfully" };
      }
      
      // Get authentication token
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;
      
      if (!token) throw new Error("Authentication token not found");
      
      console.log("Sending message to AI assistant", { message, token: token.substring(0, 10) + "..." });
      
      // Check if we need to enforce topic control
      const nonAssistantMessages = messages.filter(m => m.role === "user").length;
      
      // Check if message appears to be off-topic
      const isOffTopic = checkIfOffTopic(message);
      
      // Different response strategy based on off-topic count
      if (isOffTopic) {
        setOffTopicCount(prev => prev + 1);
        
        // After 5+ off-topic messages, suggest TMW AI
        if (offTopicCount >= 5) {
          const redirectMessage = `I notice we're getting a bit off-topic. As WAKTI AI, I'm specifically designed to help you with tasks, events, scheduling, business management, and other WAKTI platform features. For more general chat assistance, I recommend visiting TMW AI at https://tmw.qa/ai-chat-bot/.`;
          
          addAssistantMessage(redirectMessage);
          setOffTopicCount(0); // Reset counter after redirection
          return { response: redirectMessage };
        }
        // After 2-4 off-topic messages, give a gentle reminder but still answer
        else if (offTopicCount >= 2) {
          // Continue with the AI call but let the backend know to include a reminder
          message = message + " [CONTEXT: remind_about_wakti_focus]";
        }
      } else {
        // Reset counter when back on topic
        setOffTopicCount(0);
      }
      
      // Add user's system context for better assistance
      try {
        // Check what features are active for the user
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', userId)
          .single();
          
        // Get pending tasks count
        const { count: taskCount } = await supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'pending');
          
        // Try to get upcoming events count if available
        let upcomingEventCount = 0;
        try {
          const { count, error: eventsError } = await supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('start_time', new Date().toISOString());
            
          if (!eventsError) {
            upcomingEventCount = count || 0;
          }
        } catch (error) {
          console.warn("Events table might not exist yet:", error);
        }
        
        // Add context about user's system state
        let systemContext = `[SYSTEM_CONTEXT: `;
        systemContext += `account_type=${profile?.account_type || 'free'}, `;
        systemContext += `pending_tasks=${taskCount || 0}, `;
        systemContext += `upcoming_events=${upcomingEventCount}`;
        systemContext += `]`;
        
        // Append system context to message
        message = message + " " + systemContext;
        
      } catch (error) {
        console.warn("Error adding system context:", error);
        // Continue without system context if there was an error
      }
      
      // Call the edge function
      const data = await callAIAssistant(token, message, userName);
      
      // Add AI response to the list
      addAssistantMessage(data.response);
      
      return data;
    },
    onError: (error) => {
      console.error("AI assistant error:", error);
      
      // Add error message to the list
      addErrorMessage(error);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    messages,
    sendMessage,
    clearMessages,
    isProcessingCommand
  };
};
