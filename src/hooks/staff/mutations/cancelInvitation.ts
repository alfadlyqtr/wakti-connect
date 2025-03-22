
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for canceling staff invitations
 */
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string): Promise<string> => {
      const { error } = await supabase
        .from('staff_invitations')
        .delete()
        .eq('id', invitationId);
        
      if (error) throw error;
      
      toast({
        title: "Invitation Cancelled",
        description: "The staff invitation has been cancelled"
      });
      
      return invitationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
    }
  });
};
