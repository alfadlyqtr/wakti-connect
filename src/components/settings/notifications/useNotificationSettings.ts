
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface NotificationSettings {
  email_notifications: boolean;
  task_reminders: boolean;
  appointment_alerts: boolean;
  message_notifications: boolean;
  dark_mode: boolean;
  compact_view: boolean;
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: false,
    task_reminders: true,
    appointment_alerts: true,
    message_notifications: true,
    dark_mode: false,
    compact_view: false
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const saveNotificationSettings = async () => {
    try {
      setLoading(true);
      
      // In production, this would save to a notifications_settings table
      // For now, we'll just show a success toast
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
      
      if (settings.dark_mode) {
        // Update theme_preference in profiles table
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const { error } = await supabase
            .from('profiles')
            .update({ 
              theme_preference: 'dark',
              updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id);
            
          if (error) throw error;
        }
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
    saveNotificationSettings
  };
};
