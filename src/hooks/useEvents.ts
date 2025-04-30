import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEvents = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("Not authenticated");
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error("Error fetching events:", error);
          toast.error("Failed to load events");
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        throw error;
      }
    }
  });

  return {
    events: data || [],
    isLoading,
    error
  };
};
