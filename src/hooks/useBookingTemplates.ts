
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BookingTemplate {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price?: number;
  is_published: boolean;
  service_id?: string;
  staff_assigned_id?: string;
}

/**
 * Hook to fetch booking templates for a business
 */
export const useBookingTemplates = (businessId?: string) => {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['booking-templates', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('booking_templates')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_published', true);
        
      if (error) throw error;
      return data as BookingTemplate[];
    },
    enabled: !!businessId
  });
  
  return { templates, isLoading, error };
};
