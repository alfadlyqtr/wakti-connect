import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderNotification } from "@/types/reminder.types";
import { fetchReminders, createReminderNotification } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";

export function useReminders() {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());
  const [checkCount, setCheckCount] = useState(0);
  
  // Load initial reminders
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const reminders = await fetchReminders();
        setActiveReminders(reminders);
        console.log(`Loaded ${reminders.length} reminders`);
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
      }, async (payload) => {
        // Refetch reminders when changes occur
        try {
          console.log("Detected changes in reminders table:", payload);
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
  
  // Check for due reminders every 3 seconds
  useEffect(() => {
    const checkDueReminders = async () => {
      const now = new Date();
      setLastCheckTime(now);
      setCheckCount(prev => prev + 1);
      
      if (checkCount % 20 === 0) {
        console.log(`Checking reminders at ${now.toLocaleTimeString()}`);
      }
      
      // Check for reminders that are due
      const dueReminders = activeReminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminder_time);
        const reminderMinutes = reminderTime.getHours() * 60 + reminderTime.getMinutes();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const reminderTotalSeconds = reminderMinutes * 60 + reminderTime.getSeconds();
        const nowTotalSeconds = nowMinutes * 60 + now.getSeconds();
        const diffInSeconds = Math.abs(nowTotalSeconds - reminderTotalSeconds);
        return diffInSeconds <= 8;
      });
      
      // Show notifications for due reminders
      for (const reminder of dueReminders) {
        try {
          const reminderDate = new Date(reminder.reminder_time);
          console.log('Processing due reminder:', {
            reminderId: reminder.id,
            reminderTime: reminderDate.toLocaleTimeString(),
            currentTime: now.toLocaleTimeString(),
            timeDifferenceSeconds: Math.abs(now.getTime() - reminderDate.getTime()) / 1000
          });
          
          // Create notification in database
          const notification = await createReminderNotification(reminder.id);
          
          // Show notification toast
          toast({
            title: "Reminder",
            description: {
              reminder,
              notification,
              onClose: () => {},
              type: 'reminder-toast'
            },
            duration: Infinity,
          });
          
          // Create browser notification
          if (Notification && Notification.permission === 'granted') {
            new Notification('Reminder: ' + reminder.message, {
              body: `Time: ${new Date(reminder.reminder_time).toLocaleTimeString()}`,
              tag: `reminder-${reminder.id}`,
              icon: '/favicon.ico'
            });
          }
          
          console.log('Successfully triggered reminder notification:', {
            reminderId: reminder.id,
            notificationId: notification.id
          });
        } catch (error) {
          console.error("Error processing due reminder:", {
            reminderId: reminder.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          
          // Fallback toast if notification failed
          toast({
            title: "Reminder",
            description: reminder.message,
            variant: "destructive",
            duration: 10000,
          });
        }
      }
    };
    
    const interval = setInterval(checkDueReminders, 3000);
    checkDueReminders();
    return () => clearInterval(interval);
  }, [activeReminders, checkCount]);
  
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
    requestNotificationPermission,
    lastCheckTime
  };
}
