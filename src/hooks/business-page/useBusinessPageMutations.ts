
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import { toast } from "@/components/ui/use-toast";
import { fromTable } from "@/integrations/supabase/helper";

// Create business page
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await fromTable('business_pages')
        .insert({
          ...pageData,
          business_id: session.user.id
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
        title: "Page created",
        description: "Your business page has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create page",
        description: error.message
      });
    }
  });
};

// Update business page with debounce for auto-save
export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<BusinessPage>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const ownerBusinessPage = queryClient.getQueryData<BusinessPage>(['ownerBusinessPage']);
      
      if (!ownerBusinessPage?.id) {
        throw new Error("No business page found");
      }
      
      const { data, error } = await fromTable('business_pages')
        .update(updates)
        .eq('id', ownerBusinessPage.id)
        .eq('business_id', session.user.id) // Ensure owner
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
        description: "Your business page has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update page",
        description: error.message
      });
    }
  });
};

// Update a section with optimistic updates
export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sectionId, content }: { sectionId: string, content: any }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ section_content: content })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section:", error);
        throw error;
      }
      
      return data as BusinessPageSection;
    },
    onMutate: async ({ sectionId, content }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['businessPageSections'] });
      
      // Get the current pages to find the page ID
      const ownerBusinessPage = queryClient.getQueryData<BusinessPage>(['ownerBusinessPage']);
      const pageId = ownerBusinessPage?.id;
      
      // Save the previous value
      const previousSections = queryClient.getQueryData<BusinessPageSection[]>(
        ['businessPageSections', pageId]
      );
      
      // Optimistically update the UI
      if (previousSections) {
        queryClient.setQueryData<BusinessPageSection[]>(
          ['businessPageSections', pageId],
          previousSections.map(section => 
            section.id === sectionId 
              ? { ...section, section_content: content } 
              : section
          )
        );
      }
      
      return { previousSections, pageId };
    },
    onError: (err, variables, context) => {
      // If there was an error, roll back
      if (context?.previousSections && context.pageId) {
        queryClient.setQueryData(
          ['businessPageSections', context.pageId], 
          context.previousSections
        );
      }
      toast({
        variant: "destructive",
        title: "Failed to update section",
        description: "Your changes could not be saved. Please try again."
      });
    },
    onSuccess: () => {
      toast({
        title: "Section updated",
        description: "Your section has been updated."
      });
    },
    onSettled: (_, __, ___, context) => {
      if (context?.pageId) {
        queryClient.invalidateQueries({ 
          queryKey: ['businessPageSections', context.pageId] 
        });
      }
    }
  });
};
