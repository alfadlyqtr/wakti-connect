
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessPage, BusinessPageSection } from '@/types/business.types';
import { useAuth } from '@/hooks/auth';

/**
 * Mutation to create a new business page
 */
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('business_pages')
        .insert({
          ...pageData,
          business_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-page-owner'] });
    }
  });
};

/**
 * Mutation to update an existing business page
 */
export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageData: Partial<BusinessPage>) => {
      if (!pageData.id) throw new Error('Page ID is required');
      
      const { data, error } = await supabase
        .from('business_pages')
        .update(pageData)
        .eq('id', pageData.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessPage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['business-page-owner'] });
      queryClient.invalidateQueries({ queryKey: ['business-page', data.page_slug] });
    }
  });
};

/**
 * Mutation to update a page section
 */
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
      // First update the core content
      const { data, error } = await supabase
        .from('business_page_sections')
        .update({
          section_content: content,
          ...sectionUpdates
        })
        .eq('id', sectionId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as BusinessPageSection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-sections', data.page_id] });
    }
  });
};
