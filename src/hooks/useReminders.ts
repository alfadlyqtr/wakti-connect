
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderNotification } from "@/types/reminder.types";
import { fetchReminders, createReminderNotification } from "@/services/reminder/reminderService";
import ReminderToast from "@/components/reminders/ReminderToast";
import { toast } from "@/components/ui/use-toast";

export function useReminders() {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      
      // Show notifications for due reminders
      for (const reminder of dueReminders) {
        // Create notification in database (this also handles repeat)
        try {
          const notification = await createReminderNotification(reminder.id);
          
          // Show notification toast
          toast({
            title: "Reminder",
            description: (
              <ReminderToast 
                reminder={reminder} 
                notification={notification} 
                onClose={() => {}}
              />
            ),
            duration: Infinity, // Don't auto-dismiss
          });
          
          // Also show browser notification if supported and permission granted
          if (Notification && Notification.permission === 'granted') {
            new Notification('WAKTI Reminder', {
              body: reminder.message
            });
          }
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
    if (Notification && Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }, []);
  
  return {
    loading,
    activeReminders,
    requestNotificationPermission
  };
}
