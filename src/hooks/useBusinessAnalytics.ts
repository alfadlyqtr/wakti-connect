
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getGrowthTrendsData, getServiceDistributionData } from "@/utils/businessAnalyticsUtils";

type AnalyticsTimeRange = "week" | "month" | "year";

export interface BusinessAnalyticsData {
  subscriberCount: number;
  appointmentCount: number;
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated');
      }
      
      // In a real application, this would fetch data from the backend
      // based on the selected time range
      const growthData = getGrowthTrendsData();
      const serviceData = getServiceDistributionData();
      
      return {
        subscriberCount: 157,
        appointmentCount: 352,
        staffCount: 5,
        taskCompletionRate: 87,
        timeRange,
        growth: growthData.datasets[0].data,
        serviceDistribution: serviceData.datasets[0].data
      } as BusinessAnalyticsData;
    }
  });
};
