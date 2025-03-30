
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import { AIAssistantSettings } from "@/components/settings/ai";
import { useAuth } from "@/hooks/auth";
import CurrencyTab from "@/components/settings/CurrencyTab";
import BillingTab from "@/components/settings/BillingTab";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardSettings = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { data: profileData } = useProfileSettings();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabsListRef = React.useRef<HTMLDivElement>(null);
  
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
  
  // Scroll tabs horizontally
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsListRef.current) return;
    
    const container = tabsListRef.current;
    const scrollAmount = 150; // Adjust scroll amount as needed
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(scrollPosition + scrollAmount);
    }
  };
  
  if (isLoading) {
    return <div className="mx-auto max-w-7xl py-6">Loading settings...</div>;
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
        <div className="relative w-full">
          {isMobile && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0"
                onClick={() => scrollTabs('left')}
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0"
                onClick={() => scrollTabs('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <div className="mx-auto px-8 sm:px-0">
            <TabsList 
              ref={tabsListRef} 
              className="flex min-w-max space-x-2 h-auto p-1"
            >
              <TabsTrigger value="profile" className="px-3 py-1.5 whitespace-nowrap">
                {isBusinessAccount ? "Business & Account" : "Profile"}
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
          </div>
        </div>
        
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
