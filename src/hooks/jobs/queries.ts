
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";

export const useJobCardsQuery = (staffRelationId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['jobCards', staffRelationId],
    queryFn: async () => {
      let query = supabase
        .from('job_cards')
        .select(`
          *,
          jobs:job_id (
            id,
            name,
            description,
            duration,
            default_price
          )
        `);
        
      if (staffRelationId) {
        query = query.eq('staff_relation_id', staffRelationId);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
        
      if (error) {
        toast({
          title: "Error fetching job cards",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as JobCard[];
    }
  });
};
