
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number | null;
  subscriberChange?: number;
  subscriberChangeText?: string;
  staffCount: number | null;
  staffChange?: number;
  staffChangeText?: string;
  taskCompletionRate: number | null;
  completionRateChange?: number;
  completionRateChangeText?: string;
  timeRange: AnalyticsTimeRange;
  growth: number[];
  serviceDistribution: number[];
  serviceLabels: string[];
}

export const useBusinessAnalytics = (timeRange: AnalyticsTimeRange = "month") => {
  // If timeRange is undefined (which happens when user is not a business account),
  // don't execute the query
  const enabled = !!timeRange;
  
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async (): Promise<BusinessAnalyticsData> => {
      try {
        console.log("Fetching business analytics data for", timeRange);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No authenticated session");
          throw new Error('Not authenticated');
        }
        
        // Verify the user has a business account
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type, business_name')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw new Error('Could not verify account type');
        }
        
        // If not business account, throw an error
        if (profileData?.account_type !== 'business') {
          console.warn("Non-business account accessing business analytics");
          throw new Error('Business account required to access analytics');
        }
        
        // Fetch analytics data
        // First, try to get actual data from analytics tables
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('*')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .maybeSingle();
        
        if (analyticsError) {
          console.error("Error fetching analytics data:", analyticsError);
        }
        
        // Fetch subscriber count
        const { count: subscriberCount, error: subscriberError } = await supabase
          .from('business_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.user.id);
          
        if (subscriberError) {
          console.error("Error fetching subscriber count:", subscriberError);
        }
        
        // Fetch staff count
        const { count: staffCount, error: staffError } = await supabase
          .from('business_staff')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.user.id)
          .eq('status', 'active');
          
        if (staffError) {
          console.error("Error fetching staff count:", staffError);
        }
        
        // Fetch real services data
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('name, id')
          .eq('business_id', session.user.id);
          
        if (servicesError) {
          console.error("Error fetching services:", servicesError);
        }
        
        // Get actual bookings by service for distribution chart
        const serviceBookingCounts: Record<string, number> = {};
        const serviceLabels: string[] = [];
        const serviceDistribution: number[] = [];
        
        if (servicesData && servicesData.length > 0) {
          // Populate from actual services
          for (const service of servicesData) {
            serviceLabels.push(service.name);
            
            // Count bookings for this service
            const { count, error } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('business_id', session.user.id)
              .eq('service_id', service.id);
              
            if (error) {
              console.error(`Error fetching booking count for service ${service.name}:`, error);
              serviceDistribution.push(0);
            } else {
              serviceDistribution.push(count || 0);
            }
          }
        } else {
          // No services found, use empty arrays
          console.log("No services found for business");
        }
        
        // Get growth data (using real data or empty array if not found)
        const { data: growthData = [] } = await supabase
          .from('business_growth_data')
          .select('subscribers')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .order('created_at');
        
        const growth = growthData.map(item => item.subscribers) || [];
        
        // Calculate task completion rate from actual tasks
        const { count: totalTasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
          
        const { count: completedTasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('status', 'completed');
        
        // Calculate actual task completion rate
        const taskCompletionRate = totalTasksCount && totalTasksCount > 0 
          ? Math.round((completedTasksCount || 0) / totalTasksCount * 100)
          : null;
        
        // Return analytics data with real numbers where possible, nulls otherwise
        return {
          subscriberCount: subscriberCount || null,
          subscriberChangeText: "Current subscriber count",
          staffCount: staffCount || null,
          staffChangeText: "Active staff members",
          taskCompletionRate,
          completionRateChangeText: totalTasksCount ? `Based on ${totalTasksCount} tasks` : undefined,
          timeRange,
          growth,
          serviceDistribution,
          serviceLabels
        };
      } catch (error) {
        console.error("Error in useBusinessAnalytics:", error);
        throw error;
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};
