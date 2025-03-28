
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

export interface BookingTemplate {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  is_active: boolean;
  service_id?: string;
  created_at: string;
  updated_at?: string;
}

export const useBookingTemplates = (businessId?: string) => {
  return useQuery({
    queryKey: ['bookingTemplates', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await fromTable('booking_templates')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching booking templates:", error);
        throw error;
      }
      
      return data as BookingTemplate[];
    },
    enabled: !!businessId
  });
};
