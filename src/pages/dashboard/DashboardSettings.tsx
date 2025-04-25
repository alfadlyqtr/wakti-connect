
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import { AIAssistantSettings } from "@/components/settings/ai";
import CurrencyTab from "@/components/settings/CurrencyTab";
import BillingTab from "@/components/settings/BillingTab";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/features/auth";

const DashboardSettings = () => {
  const { userRole, isStaff, isLoading } = useAuth();
  const { data: profileData } = useProfileSettings();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const isBusinessAccount = userRole === 'business';
  
  if (isLoading) {
    return <div className="mx-auto max-w-7xl py-6">Loading...</div>;
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="px-3 py-1.5 whitespace-nowrap">
            {isBusinessAccount ? "Business Account" : "Profile"}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-3 py-1.5 whitespace-nowrap">
            Notifications
          </TabsTrigger>
          {!isStaff && (
            <>
              <TabsTrigger value="billing" className="px-3 py-1.5 whitespace-nowrap">
                Billing
              </TabsTrigger>
              {isBusinessAccount && (
                <TabsTrigger value="currency" className="px-3 py-1.5 whitespace-nowrap">
                  Currency
                </TabsTrigger>
              )}
              <TabsTrigger value="ai-assistant" className="px-3 py-1.5 whitespace-nowrap">
                AI Assistant
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab />
        </TabsContent>
        
        {!isStaff && (
          <>
            <TabsContent value="billing" className="space-y-4">
              <BillingTab profile={profileData} />
            </TabsContent>
            
            {isBusinessAccount && (
              <TabsContent value="currency" className="space-y-4">
                <CurrencyTab />
              </TabsContent>
            )}
            
            <TabsContent value="ai-assistant" className="space-y-4">
              <AIAssistantSettings />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
