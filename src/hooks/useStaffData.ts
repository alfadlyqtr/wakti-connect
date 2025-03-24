
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Staff {
  id: string;
  name: string;
  role: string;
  is_service_provider?: boolean;
}

export const useStaffData = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          throw new Error('Not authenticated');
        }
        
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, name, role, is_service_provider')
          .eq('business_id', session.session.user.id)
          .eq('status', 'active')
          .order('name');
          
        if (staffError) throw staffError;
        
        return staffData as Staff[];
      } catch (error) {
        console.error("Error fetching staff data:", error);
        toast({
          title: "Error fetching staff",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        throw error;
      }
    }
  });

  return {
    data: data || [],
    isLoading,
    error: error as Error | null,
    refetch
  };
};
