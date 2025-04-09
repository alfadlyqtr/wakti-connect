
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShoppingBag, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const BusinessDashboardStats = () => {
  // Get subscribers count
  const { data: subscribersData, isLoading: isLoadingSubscribers } = useQuery({
    queryKey: ['dashboardSubscribersCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { count, error } = await supabase
        .from('business_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (error) {
        console.error("Error fetching subscribers count:", error);
        return null;
      }
      
      return { subscribersCount: count || 0 };
    }
  });
  
  // Get staff count
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['dashboardStaffCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id)
        .eq('status', 'active');
        
      if (error) {
        console.error("Error fetching staff count:", error);
        return null;
      }
      
      return { staffCount: count || 0 };
    }
  });
  
  // Get services count
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['dashboardServicesCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { count, error } = await supabase
        .from('business_services')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (error) {
        console.error("Error fetching services count:", error);
        return null;
      }
      
      return { servicesCount: count || 0 };
    }
  });
  
  return (
    <>
      <SectionHeading 
        title="Business Analytics"
        centered={false}
        className="mt-8 mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoadingSubscribers ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {subscribersData?.subscribersCount !== undefined ? subscribersData.subscribersCount : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total subscribers
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Staff
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {isLoadingStaff ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {staffData?.staffCount !== undefined ? staffData.staffCount : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active staff members
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Services
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoadingServices ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {servicesData?.servicesCount !== undefined ? servicesData.servicesCount : "—"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Business services
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
