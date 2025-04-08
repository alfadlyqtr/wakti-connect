
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number;
  subscriberChangeText?: string;
  staffCount: number;
  staffChangeText?: string;
  taskCompletionRate: number;
  completionRateChangeText?: string;
  timeRange: AnalyticsTimeRange;
  growth: any[];
  serviceDistribution: any[];
}

export const useBusinessAnalytics = (timeRange: AnalyticsTimeRange = "month") => {
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      try {
        console.log("Fetching real business analytics data for", timeRange);
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
        
        // Fetch main analytics data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('*')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .maybeSingle();
        
        if (analyticsError) {
          console.error("Error fetching analytics data:", analyticsError);
          throw new Error('Failed to fetch analytics data');
        }
        
        // Fetch growth trend data
        const { data: growthData, error: growthError } = await supabase
          .from('business_growth_data')
          .select('month, subscribers')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .order('month');
        
        if (growthError) {
          console.error("Error fetching growth data:", growthError);
          throw new Error('Failed to fetch growth trend data');
        }
        
        // Fetch service distribution data
        const { data: serviceData, error: serviceError } = await supabase
          .from('business_service_distribution')
          .select('service_name, usage_count')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange);
        
        if (serviceError) {
          console.error("Error fetching service data:", serviceError);
          throw new Error('Failed to fetch service distribution data');
        }
        
        // Format growth data for chart
        const formattedGrowthData = growthData?.map(item => item.subscribers) || [];
        
        // Format service data for chart
        const formattedServiceData = serviceData?.map(item => item.usage_count) || [];
        const serviceLabels = serviceData?.map(item => item.service_name) || [];
        
        // Calculate change percentages
        let subscriberChangeText = "";
        let staffChangeText = "";
        let completionRateChangeText = "";
        
        if (analyticsData?.subscriber_count !== undefined) {
          subscriberChangeText = "Current subscriber count";
        }
        
        if (analyticsData?.staff_count !== undefined) {
          staffChangeText = "Active staff members";
        }
        
        if (analyticsData?.task_completion_rate !== undefined) {
          completionRateChangeText = `Completion rate this ${timeRange}`;
        }
        
        // Return formatted analytics data
        return {
          subscriberCount: analyticsData?.subscriber_count || 0,
          subscriberChangeText,
          staffCount: analyticsData?.staff_count || 0,
          staffChangeText,
          taskCompletionRate: analyticsData?.task_completion_rate || 0,
          completionRateChangeText,
          timeRange,
          growth: formattedGrowthData,
          serviceDistribution: formattedServiceData,
          serviceLabels: serviceLabels
        };
      } catch (error) {
        console.error("Error in useBusinessAnalytics:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
