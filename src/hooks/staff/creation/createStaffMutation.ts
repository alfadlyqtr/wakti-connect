
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Stub version of the staff creation mutation hook
export const useCreateStaffMutation = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      toast({
        title: "Staff Functionality Removed",
        description: "Staff management has been removed from this version.",
        variant: "destructive"
      });
      
      return { success: false, error: "Staff management has been removed from this version." };
    }
  });
};
