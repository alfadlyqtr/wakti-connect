
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import { AIAssistantSettings } from "@/components/settings/ai";
import { useAuth } from "@/hooks/auth";
import CurrencyTab from "@/components/settings/CurrencyTab";
import BillingTab from "@/components/settings/BillingTab";
import { useProfileSettings } from "@/hooks/useProfileSettings";

const DashboardSettings = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { data: profileData } = useProfileSettings();
  
  // Get the user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
    setIsLoading(false);
  }, [user]);
  
  // Only show Billing, Currency and AI Assistant tabs for non-staff users
  const isStaff = userRole === 'staff';
  const isBusinessAccount = userRole === 'business';
  
  // Calculate the number of tabs to show
  const getTabsCount = () => {
    if (isStaff) return 2; // Profile & Account (combined) and Notifications
    if (isBusinessAccount) return 5; // Add Currency tab for business accounts
    return 4; // No Currency tab for non-business accounts
  };
  
  if (isLoading) {
    return <div className="mx-auto max-w-7xl py-6">Loading settings...</div>;
  }
  
  return (
    <div className="mx-auto max-w-7xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full grid-cols-${getTabsCount()} gap-4 h-auto`}>
          <TabsTrigger value="profile">
            {isBusinessAccount ? "Business & Account" : "Profile"}
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {!isStaff && (
            <>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              {isBusinessAccount && (
                <TabsTrigger value="currency">Currency</TabsTrigger>
              )}
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
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
