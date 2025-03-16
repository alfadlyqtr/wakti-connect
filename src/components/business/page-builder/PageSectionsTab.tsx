
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessPageSection, SectionType } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Globe } from "lucide-react";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";
import SectionEditor from "./SectionEditor";

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

  // Section handling mutations
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
  
  const updateSectionOrder = useMutation({
    mutationFn: async ({ sectionId, newOrder }: { sectionId: string, newOrder: number }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ section_order: newOrder })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section order:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update section order",
        description: error.message
      });
    }
  });
  
  const toggleSectionVisibility = useMutation({
    mutationFn: async ({ sectionId, isVisible }: { sectionId: string, isVisible: boolean }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ is_visible: isVisible })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error toggling section visibility:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update section visibility",
        description: error.message
      });
    }
  });
  
  const deleteSection = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await fromTable('business_page_sections')
        .delete()
        .eq('id', sectionId);
      
      if (error) {
        console.error("Error deleting section:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Section deleted",
        description: "The section has been removed from your page"
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete section",
        description: error.message
      });
    }
  });
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!pageSections) return;
    
    const currentSection = pageSections.find(s => s.id === sectionId);
    if (!currentSection) return;
    
    const currentIndex = pageSections.findIndex(s => s.id === sectionId);
    let targetIndex;
    
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < pageSections.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }
    
    const targetSection = pageSections[targetIndex];
    
    // Swap orders
    updateSectionOrder.mutate({ 
      sectionId: currentSection.id, 
      newOrder: targetSection.section_order 
    });
    
    updateSectionOrder.mutate({ 
      sectionId: targetSection.id, 
      newOrder: currentSection.section_order 
    });
  };
  
  const handleToggleVisibility = (sectionId: string, currentVisibility: boolean) => {
    toggleSectionVisibility.mutate({
      sectionId,
      isVisible: !currentVisibility
    });
  };
  
  const handleAddSection = (sectionType: SectionType) => {
    createSection.mutate(sectionType);
  };
  
  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      deleteSection.mutate(sectionId);
    }
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
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('header')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Header
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('services')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Services
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('hours')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Business Hours
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('contact')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Contact Info
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('gallery')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Gallery
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('about')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          About
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleAddSection('testimonials')}
          disabled={createSection.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Testimonials
        </Button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Current Page Sections</h2>
        {pageSections && pageSections.length > 0 ? (
          <div className="space-y-4">
            {[...pageSections]
              .sort((a, b) => a.section_order - b.section_order)
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize flex items-center">
                        {section.section_type}
                        {!section.is_visible && (
                          <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                        >
                          {section.is_visible ? 
                            <Eye className="h-4 w-4" /> : 
                            <EyeOff className="h-4 w-4" />
                          }
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveSection(section.id, 'up')}
                          disabled={section.section_order === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveSection(section.id, 'down')}
                          disabled={section.section_order === pageSections.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SectionEditor section={section} />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              You haven't added any sections to your page yet.
            </p>
            <Button onClick={() => handleAddSection('header')}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Section
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSectionsTab;
