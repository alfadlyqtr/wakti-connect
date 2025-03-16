
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionType } from "@/types/business.types";

export interface SectionTemplate {
  id: string;
  section_type: SectionType;
  template_name: string;
  template_content: any;
  is_system: boolean;
  created_at: string;
}

export const useSectionTemplates = (sectionType?: SectionType) => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['sectionTemplates', sectionType],
    queryFn: async () => {
      let query = supabase
        .from('business_section_templates')
        .select('*');
        
      if (sectionType) {
        query = query.eq('section_type', sectionType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as SectionTemplate[];
    },
    enabled: true
  });
  
  return {
    templates,
    isLoading
  };
};
