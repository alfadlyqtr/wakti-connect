
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number;
  staffCount: number;
  taskCompletionRate: number;
  timeRange: AnalyticsTimeRange;
  growth: any[];
  serviceDistribution: any[];
}

export const useBusinessAnalytics = (timeRange: AnalyticsTimeRange = "month") => {
  return useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async () => {
      try {
        console.log("Business analytics: Fetching data for timeRange:", timeRange);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("Business analytics: No authenticated session");
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
        
        // Log the profile data for debugging
        console.log("Business analytics: User profile data:", profileData);
        
        // If not business account, return default values but don't show error toast
        if (profileData?.account_type !== 'business') {
          console.warn("Non-business account accessing business analytics");
          return {
            subscriberCount: 0,
            staffCount: 0,
            taskCompletionRate: 0,
            timeRange,
            growth: [],
            serviceDistribution: []
          } as BusinessAnalyticsData;
        }
        
        // Fetch analytics data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('*')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .maybeSingle();
          
        if (analyticsError) {
          console.error("Error fetching analytics data:", analyticsError);
          throw new Error('Could not fetch analytics data');
        }
        
        // Fetch growth data
        const { data: growthData, error: growthError } = await supabase
          .from('business_growth_data')
          .select('month, subscribers')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange)
          .order('created_at', { ascending: true });
          
        if (growthError) {
          console.error("Error fetching growth data:", growthError);
          throw new Error('Could not fetch growth data');
        }
        
        // Fetch service distribution data
        const { data: serviceData, error: serviceError } = await supabase
          .from('business_service_distribution')
          .select('service_name, usage_count')
          .eq('business_id', session.user.id)
          .eq('time_range', timeRange);
          
        if (serviceError) {
          console.error("Error fetching service distribution data:", serviceError);
          throw new Error('Could not fetch service distribution data');
        }
        
        // Extract growth values for chart
        const growthValues = growthData ? growthData.map(item => item.subscribers) : [];
        
        // Extract service distribution values for chart
        const serviceValues = serviceData ? serviceData.map(item => item.usage_count) : [];
        
        // Log the data for debugging
        console.log("Business analytics: Analytics data:", analyticsData);
        console.log("Business analytics: Growth data:", growthData);
        console.log("Business analytics: Service data:", serviceData);
        
        // Return the analytics data
        return {
          subscriberCount: analyticsData?.subscriber_count || 0,
          staffCount: analyticsData?.staff_count || 0,
          taskCompletionRate: analyticsData?.task_completion_rate || 0,
          timeRange,
          growth: growthValues,
          serviceDistribution: serviceValues
        } as BusinessAnalyticsData;
      } catch (error) {
        console.error("Error in useBusinessAnalytics:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};
