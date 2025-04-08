
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShoppingBag, BarChart3 } from "lucide-react";

export const BusinessDashboardStats = () => {
  const { t } = useTranslation();
  
  // Get subscribers count
  const { data: subscribersData } = useQuery({
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
  const { data: staffData } = useQuery({
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
  const { data: servicesData } = useQuery({
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
        title={t('dashboard.businessAnalytics')}
        centered={false}
        className="mt-8 mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.subscribers')}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribersData?.subscribersCount !== undefined ? subscribersData.subscribersCount : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.totalSubscribers')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.staff')}
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffData?.staffCount !== undefined ? staffData.staffCount : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.activeStaff')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sidebar.services')}
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {servicesData?.servicesCount !== undefined ? servicesData.servicesCount : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.businessServices')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
