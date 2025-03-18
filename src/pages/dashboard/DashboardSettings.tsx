import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import AccountTab from "@/components/settings/AccountTab";
import BillingTab from "@/components/settings/BillingTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import { AIAssistantSettings } from "@/components/settings/ai";

const DashboardSettings = () => {
  return (
    <div className="mx-auto max-w-7xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-4 h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <AccountTab />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <BillingTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="ai-assistant" className="space-y-4">
          <AIAssistantSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
