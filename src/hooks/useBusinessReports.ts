import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

export const useBusinessReports = () => {
  const { data: subscriberCount, isLoading: subscribersLoading } = useQuery({
    queryKey: ['businessSubscribers'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('subscriber_count')
        .eq('business_id', session.session.user.id)
        .maybeSingle();
        
      if (analyticsError) throw analyticsError;
      
      if (analyticsData?.subscriber_count !== undefined) {
        return analyticsData.subscriber_count;
      }
      
      const { count, error } = await supabase
        .from('business_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    },
    refetchOnWindowFocus: false
  });

  const { data: staffCount, isLoading: staffLoading } = useQuery({
    queryKey: ['businessStaffCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('staff_count')
        .eq('business_id', session.session.user.id)
        .maybeSingle();
        
      if (analyticsError) throw analyticsError;
      
      if (analyticsData?.staff_count !== undefined) {
        return analyticsData.staff_count;
      }
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id)
        .eq('status', 'active');
        
      if (error) throw error;
      return count || 0;
    },
    refetchOnWindowFocus: false
  });

  const { data: serviceCount, isLoading: servicesLoading } = useQuery({
    queryKey: ['businessServiceCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { count, error } = await supabase
        .from('business_services')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      return count || 0;
    },
    refetchOnWindowFocus: false
  });
  
  const { data: bookingCount, isLoading: bookingsLoading } = useQuery({
    queryKey: ['businessBookingCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.session.user.id)
        .gte('created_at', startOfMonth.toISOString());
        
      if (error) throw error;
      return count || 0;
    },
    refetchOnWindowFocus: false
  });
  
  const { data: bookingActivityData, isLoading: bookingActivityLoading } = useQuery({
    queryKey: ['businessBookingActivity'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_booking_activity')
        .select('month, bookings')
        .eq('business_id', session.session.user.id)
        .eq('time_range', 'month')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: false
  });
  
  const { data: subscriberGrowthData, isLoading: subscriberGrowthLoading } = useQuery({
    queryKey: ['businessSubscriberGrowth'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_growth_data')
        .select('month, subscribers')
        .eq('business_id', session.session.user.id)
        .eq('time_range', 'month')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: false
  });
  
  const { data: serviceDistributionData, isLoading: serviceDistributionLoading } = useQuery({
    queryKey: ['businessServiceDistribution'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_service_distribution')
        .select('service_name, usage_count')
        .eq('business_id', session.session.user.id)
        .eq('time_range', 'month');
        
      if (error) throw error;
      
      return data.map(item => ({
        name: item.service_name,
        value: item.usage_count
      })) || [];
    },
    refetchOnWindowFocus: false
  });
  
  const { data: staffActivityData, isLoading: staffActivityLoading } = useQuery({
    queryKey: ['businessStaffActivity'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_staff_activity')
        .select('staff_name, hours_worked')
        .eq('business_id', session.session.user.id)
        .eq('time_range', 'month');
        
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: false
  });
  
  const calculateGrowthRate = () => {
    if (!subscriberGrowthData || subscriberGrowthData.length < 2) return "+0%";
    
    const latestMonth = subscriberGrowthData[subscriberGrowthData.length - 1];
    const previousMonth = subscriberGrowthData[subscriberGrowthData.length - 2];
    
    if (!latestMonth || !previousMonth || previousMonth.subscribers === 0) return "+0%";
    
    const growthRate = ((latestMonth.subscribers - previousMonth.subscribers) / previousMonth.subscribers) * 100;
    return `${growthRate > 0 ? "+" : ""}${Math.round(growthRate)}%`;
  };

  return {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading,
    bookingCount,
    bookingsLoading,
    bookingActivityData,
    bookingActivityLoading,
    subscriberGrowthData,
    subscriberGrowthLoading,
    serviceDistributionData,
    serviceDistributionLoading,
    staffActivityData,
    staffActivityLoading,
    subscriberGrowthRate: calculateGrowthRate()
  };
};
