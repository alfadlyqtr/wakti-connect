
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface NotificationSettings {
  email_notifications: boolean;
  task_reminders: boolean;
  appointment_alerts: boolean;
  message_notifications: boolean;
  dark_mode: boolean;
  compact_view: boolean;
  auto_approve_contacts: boolean;
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: false,
    task_reminders: true,
    appointment_alerts: true,
    message_notifications: true,
    dark_mode: false,
    compact_view: false,
    auto_approve_contacts: false
  });
  
  const [loading, setLoading] = useState(false);
  
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
  
  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
    saveNotificationSettings
  };
};
