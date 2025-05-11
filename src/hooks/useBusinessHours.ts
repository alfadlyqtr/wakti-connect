
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { WorkingHour } from "@/types/business-settings.types";

export interface BusinessHours {
  id: string;
  business_id: string;
  hours: WorkingHour[];
  is_automatic: boolean;
  created_at: string;
  updated_at: string;
}

export const useBusinessHours = (businessId?: string) => {
  const queryClient = useQueryClient();

  const { data: businessHours, isLoading } = useQuery({
    queryKey: ['businessHours', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is okay
        throw new Error(`Error fetching business hours: ${error.message}`);
      }
      
      return data as BusinessHours | null;
    },
    enabled: !!businessId
  });

  const upsertBusinessHours = useMutation({
    mutationFn: async ({ hours, isAutomatic }: { hours: WorkingHour[], isAutomatic: boolean }) => {
      if (!businessId) {
        throw new Error("Business ID is required");
      }

      const hourData = JSON.stringify(hours);

      if (businessHours?.id) {
        // Update existing hours
        const { data, error } = await supabase
          .from('business_hours')
          .update({
            hours: hourData,
            is_automatic: isAutomatic,
            updated_at: new Date().toISOString()
          })
          .eq('id', businessHours.id)
          .select();

        if (error) throw new Error(`Error updating business hours: ${error.message}`);
        return data;
      } else {
        // Insert new hours
        const { data, error } = await supabase
          .from('business_hours')
          .insert({
            business_id: businessId,
            hours: hourData,
            is_automatic: isAutomatic
          })
          .select();

        if (error) throw new Error(`Error creating business hours: ${error.message}`);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessHours', businessId] });
      toast({
        title: "Business hours updated",
        description: "Your business hours have been saved successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving hours",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    businessHours: businessHours as BusinessHours | null,
    isLoading,
    upsertBusinessHours
  };
};
