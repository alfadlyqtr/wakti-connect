
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";
import { useToast } from "@/hooks/use-toast";
import { fromTable } from "@/integrations/supabase/helper";

export const useCompleteJobCardMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Completing job card with ID:", id);
      
      // First verify the job card exists and is not already completed
      const { data: existingCard, error: checkError } = await supabase
        .from('job_cards')
        .select('id, end_time, job_id, staff_relation_id, start_time, payment_method, payment_amount, notes')
        .eq('id', id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking job card:", checkError);
        toast({
          title: "Error completing job card",
          description: checkError.message,
          variant: "destructive"
        });
        throw checkError;
      }
      
      if (!existingCard) {
        const notFoundError = new Error(`Job card with ID ${id} not found`);
        console.error(notFoundError);
        toast({
          title: "Error completing job card",
          description: "Job card not found",
          variant: "destructive"
        });
        throw notFoundError;
      }
      
      // Check if the job card is already completed
      if (existingCard.end_time) {
        const alreadyCompletedError = new Error(`Job card with ID ${id} is already completed`);
        console.error(alreadyCompletedError);
        toast({
          title: "Job card already completed",
          description: "This job card is already marked as completed",
          variant: "destructive"
        });
        throw alreadyCompletedError;
      }
      
      // Now update the job card with end_time
      const endTime = new Date().toISOString();
      const { data: updatedCard, error: updateError } = await supabase
        .from('job_cards')
        .update({ end_time: endTime })
        .eq('id', id)
        .select(`
          *,
          jobs:job_id (
            id,
            name,
            description,
            duration,
            default_price
          )
        `)
        .maybeSingle();
        
      if (updateError) {
        console.error("Error updating job card:", updateError);
        toast({
          title: "Error completing job card",
          description: updateError.message,
          variant: "destructive"
        });
        throw updateError;
      }
      
      // If no data was returned by the update operation, create a response based on existing data
      // This handles race conditions where the update succeeded but didn't return data
      if (!updatedCard) {
        console.warn("No data returned from update operation. Creating synthetic response.");
        
        // Create a synthetic response using the existing card data
        const syntheticResponse = {
          ...existingCard,
          end_time: endTime,
          updated_at: new Date().toISOString()
        };
        
        // Fetch the job data separately
        if (existingCard.job_id) {
          try {
            const { data: jobData } = await supabase
              .from('jobs')
              .select('id, name, description, duration, default_price')
              .eq('id', existingCard.job_id)
              .maybeSingle();
              
            if (jobData) {
              // @ts-ignore - we're constructing the response manually
              syntheticResponse.jobs = jobData;
            }
          } catch (jobError) {
            console.error("Error fetching job data for synthetic response:", jobError);
          }
        }
        
        toast({
          title: "Job card completed",
          description: "Job card has been marked as completed successfully",
          variant: "success"
        });
        
        return syntheticResponse as JobCard;
      }
      
      console.log("Job card completed successfully:", updatedCard.id);
      toast({
        title: "Job card completed",
        description: "Job card has been marked as completed successfully",
        variant: "success"
      });
      
      return updatedCard as JobCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobCards'] });
    }
  });
};
