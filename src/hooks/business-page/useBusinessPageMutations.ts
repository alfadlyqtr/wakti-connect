import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

// Create a new business page
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Check if user already has a business page
      const { data: existingPage, error: checkError } = await fromTable('business_pages')
        .select()
        .eq('business_id', session.user.id)
        .single();
      
      if (existingPage) {
        throw new Error("Business page already exists");
      }
      
      // Create new page
      const { data, error } = await fromTable('business_pages')
        .insert({
          business_id: session.user.id,
          page_title: pageData.page_title || "My Business",
          page_slug: pageData.page_slug || `business-${Date.now()}`,
          description: pageData.description || "",
          is_published: pageData.is_published || false,
          primary_color: pageData.primary_color || "#3B82F6",
          secondary_color: pageData.secondary_color || "#10B981",
          text_color: pageData.text_color || "#ffffff",
          font_family: pageData.font_family || "sans-serif",
          border_radius: pageData.border_radius || "medium",
          background_color: pageData.background_color || "#ffffff",
          subscribe_button_position: pageData.subscribe_button_position || "both",
          subscribe_button_style: pageData.subscribe_button_style || "gradient",
          subscribe_button_size: pageData.subscribe_button_size || "default",
          social_icons_style: pageData.social_icons_style || "default",
          social_icons_size: pageData.social_icons_size || "default",
          social_icons_position: pageData.social_icons_position || "footer",
          content_max_width: pageData.content_max_width || "1200px",
          section_spacing: pageData.section_spacing || "default",
          show_subscribe_button: pageData.show_subscribe_button !== undefined ? pageData.show_subscribe_button : true,
          subscribe_button_text: pageData.subscribe_button_text || "Subscribe"
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
    },
    onSuccess: () => {
      toast({
        title: "Business page created",
        description: "Your business page has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create business page",
        description: error.message,
      });
    }
  });
};

// Update business page
export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Make sure we have a page ID
      if (!pageData.id) {
        throw new Error("Page ID is required for update");
      }
      
      // Update the page
      const { data, error } = await fromTable('business_pages')
        .update(pageData)
        .eq('id', pageData.id)
        .eq('business_id', session.user.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating business page:", error);
        throw error;
      }
      
      return data as BusinessPage;
    },
    onSuccess: () => {
      toast({
        title: "Page updated",
        description: "Your business page has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update page",
        description: error.message,
      });
    }
  });
};

// Update section content
export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      sectionId, 
      content,
      sectionUpdates = {}
    }: { 
      sectionId: string; 
      content: any;
      sectionUpdates?: Partial<BusinessPageSection>;
    }) => {
      // Prepare update data
      const updateData: Partial<BusinessPageSection> = {
        section_content: content,
        updated_at: new Date().toISOString(),
        ...sectionUpdates
      };
      
      // Update the section
      const { data, error } = await fromTable('business_page_sections')
        .update(updateData)
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section:", error);
        throw error;
      }
      
      return data as BusinessPageSection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update section",
        description: error.message,
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
      formData: { name: string; email: string; phone?: string; message: string } 
    }) => {
      // Submit the contact form
      const { data, error } = await fromTable('business_contact_submissions')
        .insert({
          business_id: businessId,
          page_id: pageId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error submitting contact form:", error);
        throw error;
      }
      
      return data;
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit form",
        description: error.message,
      });
    }
  });
};
