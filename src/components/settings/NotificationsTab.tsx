
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const NotificationsTab: React.FC = () => {
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
            <Switch className="mt-1 sm:mt-0" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Task Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminded about upcoming tasks
              </p>
            </div>
            <Switch defaultChecked className="mt-1 sm:mt-0" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
            <div>
              <p className="font-medium">Appointment Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive alerts for upcoming appointments
              </p>
            </div>
            <Switch defaultChecked className="mt-1 sm:mt-0" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-medium">Message Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch defaultChecked className="mt-1 sm:mt-0" />
          </div>
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
            <Switch className="mt-1 sm:mt-0" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-muted-foreground">
                Display more content with less spacing
              </p>
            </div>
            <Switch className="mt-1 sm:mt-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
