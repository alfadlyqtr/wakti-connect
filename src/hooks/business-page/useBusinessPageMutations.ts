
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { submitContactForm } from "@/services/contact";

// Create a new page
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("Creating new business page with data:", data);
      
      // Clean data to ensure valid JSON
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      const { data: response, error } = await supabase
        .from('business_pages')
        .insert(cleanData)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating business page:", error);
        throw error;
      }
      
      console.log("Business page created successfully:", response);
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
      console.error("Detailed error when creating business page:", error);
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
      console.log("Updating business page with ID:", pageId);
      console.log("Update data:", data);
      
      // Clean data to ensure valid JSON
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      if (Object.keys(cleanData).length === 0) {
        console.log("No valid data to update, skipping update");
        throw new Error("No valid data to update");
      }
      
      const { data: response, error } = await supabase
        .from('business_pages')
        .update(cleanData)
        .eq('id', pageId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating business page:", error);
        throw error;
      }
      
      console.log("Business page updated successfully:", response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      // Toast notification is now handled by the component that calls the mutation
    },
    onError: (error: any) => {
      console.error("Detailed error when updating business page:", error);
      // Toast notification is now handled by the component that calls the mutation
    }
  });
};

// Update section content
export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: any }) => {
      console.log("Updating section with ID:", sectionId);
      console.log("Section update data:", data);
      
      // Clean data to ensure valid JSON
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          // Special handling for section_content to ensure it's valid JSON
          if (key === 'section_content' && typeof value === 'object') {
            try {
              // Ensure we can stringify and parse it (valid JSON)
              const validJson = JSON.parse(JSON.stringify(value));
              acc[key] = validJson;
            } catch (error) {
              console.error("Invalid JSON in section_content:", error);
              // Skip this property
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);
      
      if (Object.keys(cleanData).length === 0) {
        console.log("No valid data to update, skipping section update");
        throw new Error("No valid data to update");
      }
      
      const { data: response, error } = await supabase
        .from('business_page_sections')
        .update(cleanData)
        .eq('id', sectionId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating section:", error);
        throw error;
      }
      
      console.log("Section updated successfully:", response);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
      // Toast notification is now handled by the component that calls the mutation
    },
    onError: (error: any) => {
      console.error("Detailed error when updating section:", error);
      // Toast notification is now handled by the component that calls the mutation
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
