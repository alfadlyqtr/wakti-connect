
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderNotification } from "@/types/reminder.types";
import { fetchReminders, createReminderNotification } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";
import { requestAudioPermission, playNotificationSound } from "@/utils/audioUtils";

export function useReminders() {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());
  const [checkCount, setCheckCount] = useState(0);
  
  // Request audio permission
  useEffect(() => {
    const setupAudioPermission = async () => {
      const granted = await requestAudioPermission();
      setAudioPermissionGranted(granted);
    };
    
    setupAudioPermission();
  }, []);
  
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
      }, async () => {
        // Refetch reminders when changes occur
        try {
          console.log("Detected changes in reminders table, reloading...");
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
  
  // Check for due reminders every 5 seconds
  useEffect(() => {
    const checkDueReminders = async () => {
      const now = new Date();
      setLastCheckTime(now);
      setCheckCount(prev => prev + 1);
      
      if (checkCount % 12 === 0) { // Log every minute (12 * 5 seconds)
        console.log(`Checking reminders at ${now.toLocaleTimeString()}`);
      }
      
      // Check for reminders that are due
      const dueReminders = activeReminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminder_time);
        
        // Get time values for precise comparison
        const reminderMinutes = reminderTime.getHours() * 60 + reminderTime.getMinutes();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Get seconds for even more precise comparison
        const reminderTotalSeconds = reminderMinutes * 60 + reminderTime.getSeconds();
        const nowTotalSeconds = nowMinutes * 60 + now.getSeconds();
        
        // Consider reminders due if they're within 5 seconds of now (either just past or just coming)
        const diffInSeconds = Math.abs(nowTotalSeconds - reminderTotalSeconds);
        return diffInSeconds <= 5;
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
          
          // Play sound if enabled and permission granted
          if (audioPermissionGranted && localStorage.getItem('reminderAudioEnabled') !== 'false') {
            playNotificationSound();
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
          
          // Show browser notification if supported and permission granted
          if (Notification && Notification.permission === 'granted') {
            new Notification('Reminder: ' + reminder.message, {
              body: `Time: ${new Date(reminder.reminder_time).toLocaleTimeString()}`
            });
          }
          
          console.log('Successfully triggered reminder notification:', {
            reminderId: reminder.id,
            notificationId: notification.id
          });
          
          // Attempt to trigger browser notification 3 times in case of failure
          let notificationSuccess = false;
          const maxRetries = 3;
          
          for (let attempt = 0; attempt < maxRetries && !notificationSuccess; attempt++) {
            try {
              if (Notification && Notification.permission === 'granted') {
                new Notification('Reminder', {
                  body: reminder.message,
                  tag: `reminder-${reminder.id}` // Prevent duplicate notifications
                });
                notificationSuccess = true;
              }
            } catch (error) {
              console.warn(`Notification attempt ${attempt + 1} failed:`, error);
              await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retry
            }
          }
        } catch (error) {
          console.error("Error processing due reminder:", {
            reminderId: reminder.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    };
    
    // Check every 5 seconds
    const interval = setInterval(checkDueReminders, 5000);
    
    // Initial check
    checkDueReminders();
    
    return () => clearInterval(interval);
  }, [activeReminders, audioPermissionGranted, checkCount]);
  
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
    requestAudioPermission,
    audioPermissionGranted
  };
}
