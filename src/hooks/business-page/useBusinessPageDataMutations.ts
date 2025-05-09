
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BusinessPageData } from "@/components/business/page-builder/context/BusinessPageContext";
import { Json } from "@/types/supabase";

// Define the record type that comes back from the database
export interface BusinessPageDataRecord {
  id: string;
  user_id: string;
  page_slug: string | null;
  created_at: string;
  updated_at: string;
  page_data: BusinessPageData;
}

// Generate a slug from business name
const generateSlug = (businessName: string): string => {
  if (!businessName) return '';
  return businessName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

// Create new business page data
export const useCreateBusinessPageDataMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, pageData }: { userId: string; pageData: BusinessPageData }) => {
      console.log("Creating business page data with:", { userId, pageData });
      
      try {
        // Generate a slug from business name if available
        let pageSlug = null;
        if (pageData.pageSetup?.businessName) {
          pageSlug = generateSlug(pageData.pageSetup.businessName);
        }
        
        // Type assertion to convert BusinessPageData to Json
        const pageDataJson = pageData as unknown as Json;
        
        const { data, error } = await supabase
          .from('business_pages_data')
          .insert({
            user_id: userId,
            page_slug: pageSlug,
            page_data: pageDataJson
          })
          .select()
          .single();
          
        if (error) {
          console.error("Error creating business page data:", error);
          throw error;
        }
        
        console.log("Successfully created business page data:", data);
        
        // Convert the returned page_data JSON back to BusinessPageData
        return {
          ...data,
          page_data: data.page_data as unknown as BusinessPageData
        } as BusinessPageDataRecord;
      } catch (err) {
        console.error("Exception during create business page data:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      toast({
        title: "Success",
        description: "Your business page data has been saved",
      });
    },
    onError: (error: any) => {
      console.error("Error creating business page data:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save business page data",
      });
    }
  });
};

// Update existing business page data
export const useUpdateBusinessPageDataMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pageData }: { id: string; pageData: BusinessPageData }) => {
      console.log("Updating business page data:", { id, pageData });
      
      try {
        // Generate or update slug from business name if available
        let pageSlug = null;
        if (pageData.pageSetup?.businessName) {
          pageSlug = generateSlug(pageData.pageSetup.businessName);
        }
        
        // Type assertion to convert BusinessPageData to Json
        const pageDataJson = pageData as unknown as Json;
        
        const { data, error } = await supabase
          .from('business_pages_data')
          .update({
            page_slug: pageSlug,
            page_data: pageDataJson,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error("Error updating business page data:", error);
          throw error;
        }
        
        console.log("Successfully updated business page data:", data);
        
        // Convert the returned page_data JSON back to BusinessPageData
        return {
          ...data,
          page_data: data.page_data as unknown as BusinessPageData
        } as BusinessPageDataRecord;
      } catch (err) {
        console.error("Exception during update business page data:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
    },
    onError: (error: any) => {
      console.error("Error updating business page data:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save changes to your business page",
      });
    }
  });
};
