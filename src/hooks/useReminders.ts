
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderNotification } from "@/types/reminder.types";
import { fetchReminders, createReminderNotification } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";
import { sendPushNotification, getNotificationUrl, ensureNotificationPermission } from "@/utils/progressierNotifications";

export function useReminders() {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Request notification permissions on initialization
  useEffect(() => {
    ensureNotificationPermission();
  }, []);
  
  // Load initial reminders
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const reminders = await fetchReminders();
        setActiveReminders(reminders);
      } catch (error) {
        console.error("Error loading reminders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReminders();
  }, []);
  
  // Set up realtime subscription for reminders
  useEffect(() => {
    const subscription = supabase
      .channel('reminders-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reminders'
      }, async () => {
        // Refetch reminders when changes occur
        try {
          const reminders = await fetchReminders();
          setActiveReminders(reminders);
        } catch (error) {
          console.error("Error reloading reminders after change:", error);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // Check for due reminders every minute
  useEffect(() => {
    const checkDueReminders = async () => {
      const now = new Date();
      
      // Check for reminders that are due (within the last minute to now)
      const dueReminders = activeReminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminder_time);
        const diffInMinutes = (now.getTime() - reminderTime.getTime()) / (1000 * 60);
        // Consider reminders due if they're within the last minute
        return diffInMinutes >= 0 && diffInMinutes <= 1;
      });
      
      // Check for tasks that will be due soon for advance notifications
      const tasks = activeReminders.filter(reminder => {
        if (!reminder.task_id) return false;
        
        const reminderTime = new Date(reminder.reminder_time);
        const diffInMinutes = (reminderTime.getTime() - now.getTime()) / (1000 * 60);
        
        // Check for various time intervals (5, 10, 15, 30, 60 minutes)
        return [5, 10, 15, 30, 60].includes(Math.round(diffInMinutes));
      });
      
      // Send push notifications for tasks due soon
      for (const task of tasks) {
        const reminderTime = new Date(task.reminder_time);
        const diffInMinutes = Math.round((reminderTime.getTime() - now.getTime()) / (1000 * 60));
        
        try {
          if (task.task_id) {
            const timePhrase = diffInMinutes === 60 ? '1 hour' : `${diffInMinutes} minutes`;
            await sendPushNotification(
              'Task Due Soon',
              `"${task.message}" is due in ${timePhrase}`,
              getNotificationUrl('task', task.task_id),
              undefined,
              `task_due_${task.id}`,
              { id: task.id, type: 'task_due', entityId: task.task_id }
            );
          }
        } catch (error) {
          console.error("Error sending task due notification:", error);
        }
      }
      
      // Show notifications for due reminders
      for (const reminder of dueReminders) {
        // Create notification in database (this also handles repeat)
        try {
          const notification = await createReminderNotification(reminder.id);
          
          // Send push notification
          if (reminder.task_id) {
            await sendPushNotification(
              'Task Reminder',
              reminder.message,
              getNotificationUrl('task', reminder.task_id),
              undefined,
              `task_reminder_${reminder.id}`,
              { id: reminder.id, type: 'task_reminder', entityId: reminder.task_id }
            );
          } else {
            await sendPushNotification(
              'Reminder',
              reminder.message,
              window.location.origin,
              undefined,
              `reminder_${reminder.id}`,
              { id: reminder.id, type: 'reminder' }
            );
          }
          
          // Show notification toast
          toast({
            title: "Reminder",
            description: {
              reminder,
              notification,
              onClose: () => {},
              type: 'reminder-toast'
            },
            duration: Infinity, // Don't auto-dismiss
          });
        } catch (error) {
          console.error("Error processing due reminder:", error);
        }
      }
    };
    
    const interval = setInterval(checkDueReminders, 60000); // Check every minute
    
    // Initial check
    checkDueReminders();
    
    return () => clearInterval(interval);
  }, [activeReminders]);
  
  // Utility function to request notification permissions
  const requestNotificationPermission = useCallback(async () => {
    return await ensureNotificationPermission();
  }, []);
  
  return {
    loading,
    activeReminders,
    requestNotificationPermission
  };
}
