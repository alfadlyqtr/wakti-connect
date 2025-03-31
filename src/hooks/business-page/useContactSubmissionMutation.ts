
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { submitContactForm } from "@/services/contact";

// Submit contact form
export const useSubmitContactFormMutation = () => {
  return useMutation({
    mutationFn: async ({ 
      businessId, 
      pageId, 
      formData 
    }: { 
      businessId: string; 
      pageId: string; 
      formData: { 
        name: string; 
        email: string | null; 
        phone: string; 
        message: string | null 
      } 
    }) => {
      return submitContactForm({
        businessId,
        pageId,
        formData
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to submit form",
        description: error.message || "An error occurred while submitting the form",
      });
    }
  });
};
