
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface NotificationSettings {
  email_notifications: boolean;
  task_reminders: boolean;
  appointment_alerts: boolean;
  message_notifications: boolean;
  dark_mode: boolean;
  compact_view: boolean;
}

const NotificationsTab: React.FC = () => {
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
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch 
              checked={settings.email_notifications}
              onCheckedChange={() => handleToggle('email_notifications')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Task Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminded about upcoming tasks
              </p>
            </div>
            <Switch 
              checked={settings.task_reminders}
              onCheckedChange={() => handleToggle('task_reminders')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Appointment Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive alerts for upcoming appointments
              </p>
            </div>
            <Switch 
              checked={settings.appointment_alerts}
              onCheckedChange={() => handleToggle('appointment_alerts')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <p className="font-medium">Message Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch 
              checked={settings.message_notifications}
              onCheckedChange={() => handleToggle('message_notifications')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <Button 
            onClick={saveNotificationSettings}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark mode
              </p>
            </div>
            <Switch 
              checked={settings.dark_mode}
              onCheckedChange={() => handleToggle('dark_mode')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-muted-foreground">
                Display more content with less spacing
              </p>
            </div>
            <Switch 
              checked={settings.compact_view}
              onCheckedChange={() => handleToggle('compact_view')}
              className="mt-1 sm:mt-0" 
            />
          </div>
          
          <Button 
            onClick={saveNotificationSettings}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Appearance"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
