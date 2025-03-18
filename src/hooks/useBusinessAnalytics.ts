
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  subscriberCount: number;
  staffCount: number;
  taskCompletionRate: number;
  timeRange: "day" | "week" | "month" | "year";
  growth: {
    date: string;
    subscribers: number;
    bookings: number;
  }[];
  serviceDistribution: {
    name: string;
    value: number;
  }[];
}

export const useBusinessAnalytics = (timeRange: "day" | "week" | "month" | "year") => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['businessAnalytics', timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("Authentication required");
      }
      
      try {
        // Get subscriber count
        const { count: subscriberCount, error: subscriberError } = await supabase
          .from('business_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.user.id);
          
        if (subscriberError) throw subscriberError;
        
        // Get staff count
        const { count: staffCount, error: staffError } = await supabase
          .from('business_staff')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', session.user.id);
          
        if (staffError) throw staffError;
        
        // Get task completion stats
        const { data: taskStats, error: taskError } = await supabase
          .from('tasks')
          .select('status')
          .eq('user_id', session.user.id);
          
        if (taskError) throw taskError;
        
        const completedTasks = taskStats.filter(task => task.status === 'completed').length;
        const totalTasks = taskStats.length;
        const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Get service distribution
        const { data: services, error: servicesError } = await supabase
          .from('business_services')
          .select('name, id')
          .eq('business_id', session.user.id);
          
        if (servicesError) throw servicesError;
        
        // For each service, count bookings
        const serviceDistribution = await Promise.all(
          services.map(async (service) => {
            const { count, error: bookingError } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('service_id', service.id);
              
            if (bookingError) throw bookingError;
            
            return {
              name: service.name,
              value: count || 0
            };
          })
        );
        
        // Generate sample growth data (in a real app, this would be actual data)
        const today = new Date();
        const growth = [];
        
        // Generate sample data for the past 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          
          growth.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            subscribers: Math.floor(Math.random() * 50) + (50 - i * 8), // Sample data with growth trend
            bookings: Math.floor(Math.random() * 30) + (30 - i * 5)     // Sample data with growth trend
          });
        }
        
        return {
          subscriberCount: subscriberCount || 0,
          staffCount: staffCount || 0,
          taskCompletionRate,
          timeRange,
          growth,
          serviceDistribution
        };
      } catch (error) {
        console.error("Error fetching business analytics:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });

  return {
    data,
    isLoading,
    error
  };
};
