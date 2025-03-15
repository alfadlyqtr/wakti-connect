
import React, { useState, useEffect } from "react";
import { Bell, Trash2, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const DashboardNotifications = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user role from Supabase
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          if (profileData?.account_type) {
            setUserRole(profileData.account_type as "free" | "individual" | "business");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUserRole();
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
      }
    });

    // In a real app, we would fetch notifications from the API
    // For now, just setting empty array
    setNotifications([]);

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Demo empty state
  if (notifications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important alerts and notifications.
          </p>
        </div>
        
        {isPaidAccount ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  You're all caught up! No new notifications at this time.
                </p>
              </div>
            </div>
          </Tabs>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-center text-sm text-muted-foreground max-w-xs">
                You're all caught up! No new notifications at this time.
              </p>
              {userRole === "free" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  View Only
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with important alerts and notifications.
        </p>
      </div>
      
      {/* This would be populated with actual notifications in a real app */}
    </div>
  );
};

export default DashboardNotifications;
