import React from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus, Save, Trash2, ArrowDown, ArrowUp, Eye, EyeOff, Globe } from "lucide-react";
import { SectionType } from "@/types/business.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionEditor from "./SectionEditor";

const BusinessPageBuilder = () => {
  const queryClient = useQueryClient();
  const { 
    ownerBusinessPage, 
    pageSections, 
    socialLinks, 
    updatePage, 
    isLoading
  } = useBusinessPage();
  
  // Create state for editable page data
  const [pageData, setPageData] = React.useState({
    page_title: "",
    page_slug: "",
    description: "",
    is_published: false,
    chatbot_enabled: false,
    primary_color: "#3B82F6",
    secondary_color: "#10B981"
  });
  
  // Update local state from fetched data
  React.useEffect(() => {
    if (ownerBusinessPage) {
      setPageData({
        page_title: ownerBusinessPage.page_title || "",
        page_slug: ownerBusinessPage.page_slug || "",
        description: ownerBusinessPage.description || "",
        is_published: ownerBusinessPage.is_published || false,
        chatbot_enabled: ownerBusinessPage.chatbot_enabled || false,
        primary_color: ownerBusinessPage.primary_color || "#3B82F6",
        secondary_color: ownerBusinessPage.secondary_color || "#10B981"
      });
    }
  }, [ownerBusinessPage]);
  
  const handlePageDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setPageData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSavePageSettings = () => {
    if (!ownerBusinessPage) return;
    
    updatePage.mutate(pageData);
  };
  
  // Section handling
  const createSection = useMutation({
    mutationFn: async (sectionType: SectionType) => {
      if (!ownerBusinessPage) {
        throw new Error("No business page found");
      }
      
      // Calculate highest order + 1
      const highestOrder = pageSections && pageSections.length > 0
        ? Math.max(...pageSections.map(s => s.section_order))
        : -1;
      
      const nextOrder = highestOrder + 1;
      
      const { data, error } = await supabase
        .from('business_page_sections')
        .insert({
          page_id: ownerBusinessPage.id,
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
      const { data, error } = await supabase
        .from('business_page_sections')
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
      const { data, error } = await supabase
        .from('business_page_sections')
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
      const { error } = await supabase
        .from('business_page_sections')
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
  
  const getPublicPageUrl = () => {
    if (!ownerBusinessPage) return '';
    return `${window.location.origin}/business/${ownerBusinessPage.page_slug}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!ownerBusinessPage) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Business Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          You don't have a business page set up yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Business Landing Page Builder</h1>
      
      <Tabs defaultValue="sections">
        <TabsList className="mb-6">
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        {/* Page Sections Tab */}
        <TabsContent value="sections">
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
        </TabsContent>
        
        {/* Page Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>
                Configure basic settings for your business landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page_title">Page Title</Label>
                  <Input
                    id="page_title"
                    name="page_title"
                    value={pageData.page_title}
                    onChange={handlePageDataChange}
                    placeholder="My Business"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page_slug">
                    Page URL Slug
                    <span className="text-xs text-muted-foreground ml-2">
                      (e.g. my-business)
                    </span>
                  </Label>
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mr-2">
                      /business/
                    </div>
                    <Input
                      id="page_slug"
                      name="page_slug"
                      value={pageData.page_slug}
                      onChange={handlePageDataChange}
                      placeholder="my-business"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Page Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={pageData.description || ""}
                  onChange={handlePageDataChange}
                  placeholder="Describe your business in a few sentences"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary_color"
                      name="primary_color"
                      type="color"
                      value={pageData.primary_color}
                      onChange={handlePageDataChange}
                      className="w-12 h-9 p-1"
                    />
                    <Input
                      type="text"
                      value={pageData.primary_color}
                      onChange={handlePageDataChange}
                      name="primary_color"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary_color"
                      name="secondary_color"
                      type="color"
                      value={pageData.secondary_color}
                      onChange={handlePageDataChange}
                      className="w-12 h-9 p-1"
                    />
                    <Input
                      type="text"
                      value={pageData.secondary_color}
                      onChange={handlePageDataChange}
                      name="secondary_color"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={pageData.is_published}
                  onCheckedChange={(checked) => handleToggleChange('is_published', checked)}
                />
                <Label htmlFor="is_published">
                  Publish Page
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="chatbot_enabled"
                  checked={pageData.chatbot_enabled}
                  onCheckedChange={(checked) => handleToggleChange('chatbot_enabled', checked)}
                />
                <Label htmlFor="chatbot_enabled">
                  Enable AI Chatbot
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePageSettings} disabled={updatePage.isPending}>
                {updatePage.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Page Preview</CardTitle>
              <CardDescription>
                Preview how your landing page will appear to visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex justify-center">
                <div className="border rounded-lg overflow-hidden w-full">
                  <iframe
                    src={getPublicPageUrl()}
                    className="w-full h-[600px]"
                    title="Page Preview"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <p className="text-sm text-muted-foreground">
                <strong>Public URL:</strong> {getPublicPageUrl()}
              </p>
              <Button 
                variant="outline" 
                asChild
              >
                <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  View Full Page
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessPageBuilder;
