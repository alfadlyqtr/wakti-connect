
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, UserCircle, Bell, Palette } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import AccountTab from "@/components/settings/AccountTab";
import ProfileTab from "@/components/settings/ProfileTab";
import BillingTab from "@/components/settings/BillingTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import useIsMobile from "@/hooks/use-mobile";

const DashboardSettings = () => {
  const { data: profile } = useProfileSettings();
  const isMobile = useIsMobile();
  const isBusinessAccount = profile?.account_type === 'business';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-4 lg:w-[600px]'}`}>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "hidden sm:inline"}>Account</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "hidden sm:inline"}>
              {isBusinessAccount ? "Business" : "Profile"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "hidden sm:inline"}>Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "hidden sm:inline"}>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <AccountTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <ProfileTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4 mt-4">
          <BillingTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
