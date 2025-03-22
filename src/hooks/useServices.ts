
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "./useServiceCrud";

export const useServices = () => {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("business_services")
        .select("*")
        .order("name");

      if (error) throw error;

      // Transform the database records to match our Service type
      return data.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: service.price || 0,
        duration: service.duration || 60,
        status: "active", // Default status
      }));
    },
  });

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
