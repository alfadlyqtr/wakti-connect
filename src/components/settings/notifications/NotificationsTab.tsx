
import React from "react";
import NotificationSettingsCard from "./NotificationSettingsCard";
import { useNotificationSettings } from "./useNotificationSettings";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotificationsTab: React.FC = () => {
  const { settings, loading, handleToggle, saveNotificationSettings } = useNotificationSettings();
  
  const notificationSettings = [
    {
      key: "browser_notifications",
      title: "Browser Notifications",
      description: "Get real-time notifications in your browser",
      checked: settings.browser_notifications
    },
    {
      key: "email_notifications",
      title: "Email Notifications",
      description: "Receive notifications via email",
      checked: settings.email_notifications
    },
    {
      key: "task_reminders",
      title: "Task Reminders",
      description: "Get reminded about upcoming tasks",
      checked: settings.task_reminders
    },
    {
      key: "appointment_alerts",
      title: "Appointment Alerts",
      description: "Receive alerts for upcoming appointments",
      checked: settings.appointment_alerts
    },
    {
      key: "message_notifications",
      title: "Message Notifications",
      description: "Get notified when you receive new messages",
      checked: settings.message_notifications
    }
  ];
  
  const contactSettings = [
    {
      key: "auto_approve_contacts",
      title: "Auto-Approve Contacts",
      description: "Automatically accept all contact requests",
      checked: settings.auto_approve_contacts
    }
  ];
  
  const appearanceSettings = [
    {
      key: "dark_mode",
      title: "Dark Mode",
      description: "Toggle between light and dark mode",
      checked: settings.dark_mode
    },
    {
      key: "compact_view",
      title: "Compact View",
      description: "Display more content with less spacing",
      checked: settings.compact_view
    }
  ];
  
  return (
    <div className="space-y-4">
      {!settings.browser_notifications && Notification?.permission === "denied" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Browser notifications are blocked. Please enable them in your browser settings to receive notifications.
          </AlertDescription>
        </Alert>
      )}
      
      <NotificationSettingsCard
        title="Notification Preferences"
        description="Manage how and when you receive notifications."
        settings={notificationSettings}
        onToggle={handleToggle}
        onSave={saveNotificationSettings}
        loading={loading}
      />
      
      <NotificationSettingsCard
        title="Contact Settings"
        description="Manage how contact requests are handled."
        settings={contactSettings}
        onToggle={handleToggle}
        onSave={saveNotificationSettings}
        loading={loading}
      />
      
      <NotificationSettingsCard
        title="Appearance Settings"
        description="Customize the look and feel of your dashboard."
        settings={appearanceSettings}
        onToggle={handleToggle}
        onSave={saveNotificationSettings}
        loading={loading}
      />
    </div>
  );
};

export default NotificationsTab;
