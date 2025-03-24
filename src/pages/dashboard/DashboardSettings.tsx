
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import AccountTab from "@/components/settings/AccountTab";
import BillingTab from "@/components/settings/BillingTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import CurrencyTab from "@/components/settings/CurrencyTab";
import { AIAssistantSettings } from "@/components/settings/ai";
import { useAuth } from "@/hooks/auth";

const DashboardSettings = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Get the user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
    setIsLoading(false);
  }, [user]);
  
  // Only show Billing, Currency, and AI Assistant tabs for non-staff users
  const isStaff = userRole === 'staff';
  
  // Only show Currency tab for business accounts
  const isBusinessAccount = userRole === 'business';
  
  if (isLoading) {
    return <div className="mx-auto max-w-7xl py-6">Loading settings...</div>;
  }
  
  // Calculate the number of tabs to determine grid columns
  const tabCount = isStaff ? 3 : (isBusinessAccount ? 6 : 5);
  
  return (
    <div className="mx-auto max-w-7xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full grid-cols-${tabCount} gap-4 h-auto`}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
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
        
        <TabsContent value="account" className="space-y-4">
          <AccountTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab />
        </TabsContent>
        
        {!isStaff && (
          <>
            <TabsContent value="billing" className="space-y-4">
              <BillingTab />
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
