
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { submitContactForm } from "@/services/contact";

// Create a new page
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: response, error } = await supabase
        .from('business_pages')
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      toast({
        title: "Success",
        description: "Your business page has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create business page",
      });
    }
  });
};

// Update page settings
export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, data }: { pageId: string; data: any }) => {
      const { data: response, error } = await supabase
        .from('business_pages')
        .update(data)
        .eq('id', pageId)
        .select()
        .single();
        
      if (error) throw error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update business page",
      });
    }
  });
};

// Update section content
export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: any }) => {
      const { data: response, error } = await supabase
        .from('business_page_sections')
        .update(data)
        .eq('id', sectionId)
        .select()
        .single();
        
      if (error) throw error;
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
      toast({
        title: "Section Updated",
        description: "Your changes have been saved",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update section",
      });
    }
  });
};

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
