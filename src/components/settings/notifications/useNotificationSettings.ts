
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface NotificationSettings {
  email_notifications: boolean;
  task_reminders: boolean;
  appointment_alerts: boolean;
  message_notifications: boolean;
  dark_mode: boolean;
  compact_view: boolean;
  auto_approve_contacts: boolean;
  browser_notifications: boolean;
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: false,
    task_reminders: true,
    appointment_alerts: true,
    message_notifications: true,
    dark_mode: false,
    compact_view: false,
    auto_approve_contacts: false,
    browser_notifications: false
  });
  
  const [loading, setLoading] = useState(false);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useLocalStorage<boolean>("browserNotificationsEnabled", false);
  
  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      const permission = Notification.permission;
      if (permission === "granted") {
        setBrowserNotificationsEnabled(true);
        setSettings(prev => ({ ...prev, browser_notifications: true }));
      }
    }
  }, []);
  
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Browser notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setBrowserNotificationsEnabled(true);
        return true;
      } else {
        setBrowserNotificationsEnabled(false);
        toast({
          title: "Notification permission denied",
          description: "Please enable notifications in your browser settings to receive alerts.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  // Fetch the user's current settings when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme_preference, auto_approve_contacts')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setSettings(prev => ({
              ...prev,
              dark_mode: data.theme_preference === 'dark',
              auto_approve_contacts: !!data.auto_approve_contacts
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleToggle = async (key: keyof NotificationSettings) => {
    if (key === 'browser_notifications') {
      if (!settings.browser_notifications) {
        const granted = await requestNotificationPermission();
        setSettings(prev => ({
          ...prev,
          browser_notifications: granted
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          browser_notifications: false
        }));
        setBrowserNotificationsEnabled(false);
      }
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };
  
  const saveNotificationSettings = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        // Update theme_preference and auto_approve_contacts in profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ 
            theme_preference: settings.dark_mode ? 'dark' : 'light',
            auto_approve_contacts: settings.auto_approve_contacts,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated."
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your notification settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    handleToggle,
    saveNotificationSettings,
    browserNotificationsEnabled
  };
};
