
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
          secondary_color: pageData.secondary_color || "#10B981"
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
      content 
    }: { 
      sectionId: string; 
      content: any 
    }) => {
      // Update the section
      const { data, error } = await fromTable('business_page_sections')
        .update({ 
          section_content: content,
          updated_at: new Date().toISOString()
        })
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
