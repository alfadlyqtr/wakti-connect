
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSubmitContactFormMutation = () => {
  return useMutation({
    mutationFn: async ({ 
      name, 
      email, 
      message, 
      businessId, 
      pageId,
      phone 
    }: {
      name: string;
      email?: string | null;
      message?: string | null;
      businessId: string;
      pageId: string;
      phone: string;  // Added required phone parameter
    }) => {
      if (!businessId) {
        throw new Error("Business ID is required");
      }

      const { data, error } = await supabase
        .from('business_contact_submissions')
        .insert({
          business_id: businessId,
          page_id: pageId,
          name,
          email: email || null,
          phone,  // Include phone in the insert
          message: message || null,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting contact form:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll respond to you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again later.",
      });
    },
  });
};
