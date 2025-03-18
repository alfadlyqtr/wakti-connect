
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/components/settings/notifications/useNotificationSettings";
import { AIAssistantSettings } from "@/components/settings/ai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationsTab = () => {
  const { settings, loading, handleToggle, saveNotificationSettings } = useNotificationSettings();
  
  const [activeTab, setActiveTab] = useState<string>("notifications");

  return (
    <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="block">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={() => handleToggle('email_notifications')}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-reminders" className="block">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders for upcoming tasks</p>
                </div>
                <Switch
                  id="task-reminders"
                  checked={settings.task_reminders}
                  onCheckedChange={() => handleToggle('task_reminders')}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointment-alerts" className="block">Appointment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts about appointments</p>
                </div>
                <Switch
                  id="appointment-alerts"
                  checked={settings.appointment_alerts}
                  onCheckedChange={() => handleToggle('appointment_alerts')}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="message-notifications" className="block">Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={settings.message_notifications}
                  onCheckedChange={() => handleToggle('message_notifications')}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={saveNotificationSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="ai-assistant">
        <AIAssistantSettings />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationsTab;
