
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BusinessPageData } from "@/components/business/page-builder/context/BusinessPageContext";
import { generateSlug } from "@/utils/string-utils";

// Interface for the database business_pages_data table
export interface BusinessPageDataRecord {
  id?: string;
  user_id: string;
  page_slug: string | null;
  page_data: BusinessPageData;
  created_at?: string;
  updated_at?: string;
}

// Create a new page data record
export const useCreatePageDataMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { pageData: BusinessPageData; userId: string }): Promise<BusinessPageDataRecord> => {
      const { pageData, userId } = data;
      
      // Generate a slug based on the business name if not provided
      const pageSlug = generateSlug(pageData.pageSetup.businessName);
      
      const { data: response, error } = await supabase
        .from('business_pages_data')
        .insert({
          user_id: userId,
          page_slug: pageSlug,
          page_data: pageData
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating business page data:", error);
        throw error;
      }
      
      return response as BusinessPageDataRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      toast({
        title: "Page saved",
        description: "Your business page has been saved successfully."
      });
    },
    onError: (error: any) => {
      console.error("Detailed error when saving business page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save business page"
      });
    }
  });
};

// Update an existing page data record
export const useUpdatePageDataMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      pageData: BusinessPageData;
      updateSlug?: boolean;
    }): Promise<BusinessPageDataRecord> => {
      const { id, pageData, updateSlug } = data;
      
      const updateData: Partial<BusinessPageDataRecord> = {
        page_data: pageData,
        updated_at: new Date().toISOString()
      };
      
      // Update the slug if requested
      if (updateSlug) {
        updateData.page_slug = generateSlug(pageData.pageSetup.businessName);
      }
      
      const { data: response, error } = await supabase
        .from('business_pages_data')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating business page data:", error);
        throw error;
      }
      
      return response as BusinessPageDataRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      toast({
        title: "Page saved",
        description: "Your business page has been updated successfully."
      });
    },
    onError: (error: any) => {
      console.error("Detailed error when updating business page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to update business page"
      });
    }
  });
};

// Toggle the published state of a page
export const usePublishPageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      published: boolean;
      pageData: BusinessPageData;
    }): Promise<BusinessPageDataRecord> => {
      const { id, published, pageData } = data;
      
      // Update the published state in the page data
      const updatedPageData = {
        ...pageData,
        published
      };
      
      const { data: response, error } = await supabase
        .from('business_pages_data')
        .update({
          page_data: updatedPageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error("Error publishing business page:", error);
        throw error;
      }
      
      return response as BusinessPageDataRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      const action = data?.page_data?.published ? "published" : "unpublished";
      toast({
        title: `Page ${action}`,
        description: `Your business page has been ${action} successfully.`
      });
    },
    onError: (error: any) => {
      console.error("Detailed error when publishing business page:", error);
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: error.message || "Failed to publish business page"
      });
    }
  });
};
