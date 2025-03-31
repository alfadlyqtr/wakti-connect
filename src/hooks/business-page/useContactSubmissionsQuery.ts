
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContactSubmissionsQuery = (businessId?: string | null) => {
  return useQuery({
    queryKey: ['contactSubmissions', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('business_contact_submissions')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching contact submissions:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!businessId
  });
};

export const useMarkSubmissionAsReadMutation = () => {
  return {
    mutateAsync: async (submissionId: string) => {
      const { data, error } = await supabase
        .from('business_contact_submissions')
        .update({ is_read: true })
        .eq('id', submissionId)
        .select();
      
      if (error) {
        console.error("Error marking submission as read:", error);
        throw error;
      }
      
      return data;
    }
  };
};
