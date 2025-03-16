
import React from "react";
import { BusinessPageSection, SectionType } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { AddSectionButtons } from "./";
import { SectionList } from "./";
import { EmptySectionState } from "./";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

interface PageSectionsTabProps {
  pageSections?: BusinessPageSection[];
  businessPageId?: string;
  getPublicPageUrl: () => string;
}

const PageSectionsTab: React.FC<PageSectionsTabProps> = ({ 
  pageSections, 
  businessPageId, 
  getPublicPageUrl 
}) => {
  const queryClient = useQueryClient();

  // Section creation mutation
  const createSection = useMutation({
    mutationFn: async (sectionType: SectionType) => {
      if (!businessPageId) {
        throw new Error("No business page found");
      }
      
      // Calculate highest order + 1
      const highestOrder = pageSections && pageSections.length > 0
        ? Math.max(...pageSections.map(s => s.section_order))
        : -1;
      
      const nextOrder = highestOrder + 1;
      
      const { data, error } = await fromTable('business_page_sections')
        .insert({
          page_id: businessPageId,
          section_type: sectionType,
          section_order: nextOrder,
          section_title: `New ${sectionType} section`,
          section_content: {},
          is_visible: true
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating section:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Section created",
        description: "New section has been added to your page"
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create section",
        description: error.message
      });
    }
  });
  
  const handleAddSection = (sectionType: SectionType) => {
    createSection.mutate(sectionType);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-medium">Available Sections</h2>
        <div className="ml-auto">
          <Button 
            variant="outline" 
            asChild
            className="ml-2"
          >
            <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              View Public Page
            </a>
          </Button>
        </div>
      </div>
      
      <AddSectionButtons 
        onAddSection={handleAddSection} 
        isCreating={createSection.isPending} 
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Current Page Sections</h2>
        {pageSections && pageSections.length > 0 ? (
          <SectionList 
            pageSections={pageSections} 
            businessPageId={businessPageId}
          />
        ) : (
          <EmptySectionState onAddSection={() => handleAddSection('header')} />
        )}
      </div>
    </div>
  );
};

export default PageSectionsTab;
