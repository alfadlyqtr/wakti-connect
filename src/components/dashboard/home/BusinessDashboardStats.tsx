
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShoppingBag, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";

const CARD_COMMON =
  "rounded-lg border bg-card text-card-foreground shadow-sm group transition-all duration-300 hover:shadow-lg hover:scale-[1.025]";
const CARD_HEADER = "flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2";
const CARD_CONTENT = "px-3 py-1.5";

export const BusinessDashboardStats = () => {
  const { unreadCount: notificationsCount, isLoading: notificationsLoading } = useDashboardNotifications();

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
      return { subscribersCount: count ?? 0 };
    }
  });

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
      return { staffCount: count ?? 0 };
    }
  });

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
      return { servicesCount: count ?? 0 };
    }
  });

  return (
    <>
      <SectionHeading
        title="Business Analytics"
        centered={false}
        className="mt-8 mb-4"
      />
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <Card className={CARD_COMMON}>
          <CardHeader className={CARD_HEADER}>
            <CardTitle className="text-xs font-semibold text-wakti-gold">Notifications</CardTitle>
            <Bell className="h-5 w-5 text-wakti-gold group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className={CARD_CONTENT}>
            {notificationsLoading ? (
              <Skeleton className="h-6 w-14 mb-1" />
            ) : (
              <div className="text-xl md:text-2xl font-bold">
                {typeof notificationsCount === "number" ? notificationsCount : "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {notificationsCount > 0 ? "Unread notifications" : "No new notifications"}
            </p>
          </CardContent>
        </Card>
        <Card className={CARD_COMMON}>
          <CardHeader className={CARD_HEADER}>
            <CardTitle className="text-xs font-semibold text-blue-500">Subscribers</CardTitle>
            <Users className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className={CARD_CONTENT}>
            {isLoadingSubscribers ? (
              <Skeleton className="h-6 w-14 mb-1" />
            ) : (
              <div className="text-xl md:text-2xl font-bold">
                {subscribersData?.subscribersCount ?? "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Total subscribers</p>
          </CardContent>
        </Card>
        <Card className={CARD_COMMON}>
          <CardHeader className={CARD_HEADER}>
            <CardTitle className="text-xs font-semibold text-indigo-500">Staff</CardTitle>
            <Users className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className={CARD_CONTENT}>
            {isLoadingStaff ? (
              <Skeleton className="h-6 w-14 mb-1" />
            ) : (
              <div className="text-xl md:text-2xl font-bold">
                {staffData?.staffCount ?? "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>
        <Card className={CARD_COMMON}>
          <CardHeader className={CARD_HEADER}>
            <CardTitle className="text-xs font-semibold text-green-500">Services</CardTitle>
            <ShoppingBag className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className={CARD_CONTENT}>
            {isLoadingServices ? (
              <Skeleton className="h-6 w-14 mb-1" />
            ) : (
              <div className="text-xl md:text-2xl font-bold">
                {servicesData?.servicesCount ?? "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Business services</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
