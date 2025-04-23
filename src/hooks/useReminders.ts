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
  
  // Check for due reminders every 10 seconds
  useEffect(() => {
    const checkDueReminders = async () => {
      const now = new Date();
      setLastCheckTime(now);
      
      // Check for reminders that are due
      const dueReminders = activeReminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminder_time);
        const diffInSeconds = Math.abs(now.getTime() - reminderTime.getTime()) / 1000;
        
        // Consider reminders due if they're within the last 10 seconds to now
        return diffInSeconds >= 0 && diffInSeconds <= 10;
      });
      
      // Show notifications for due reminders
      for (const reminder of dueReminders) {
        try {
          console.log('Processing due reminder:', {
            reminderId: reminder.id,
            reminderTime: reminder.reminder_time,
            currentTime: now.toISOString(),
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
            new Notification('Reminder', {
              body: reminder.message
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
        }
      }
    };
    
    // Check every 10 seconds
    const interval = setInterval(checkDueReminders, 10000);
    
    // Initial check
    checkDueReminders();
    
    return () => clearInterval(interval);
  }, [activeReminders, audioPermissionGranted]);
  
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
