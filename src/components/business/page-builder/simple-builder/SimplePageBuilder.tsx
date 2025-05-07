
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import TopBar from "./TopBar";
import { SectionType, PageSettings } from "./types";
import { useBusinessPage } from "@/hooks/business-page";
import { BusinessPageSection } from "@/types/business.types";

/**
 * Simple page builder for business pages
 * Allows users to create and edit their business page using a visual builder
 */
const SimplePageBuilder: React.FC = () => {
  // State for sections of the page
  const [sections, setSections] = useState<SectionType[]>([]);
  // Currently active section being edited (index in the sections array)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  // Current view in the editor panel (sections, theme, settings, integrations)
  const [activeTab, setActiveTab] = useState("sections");
  
  // Business page data and functions from the hook
  const { 
    ownerBusinessPage,
    ownerPageLoading,
    pageSections,
    sectionsLoading,
    createPage,
    updatePage,
    updateSection,
    isLoading,
    getPublicPageUrl
  } = useBusinessPage();
  
  // Default page settings
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business Page",
    theme: "light",
    primaryColor: "#3B82F6",
    fontFamily: "Inter",
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false },
    ],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      whatsapp: "",
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: ""
    },
    googleMapsUrl: "",
    tmwChatbotCode: ""
  });
  
  // Handle saving business page
  const handleSave = async () => {
    try {
      if (!ownerBusinessPage) {
        throw new Error("No business page found");
      }
      
      // Update page title and other settings
      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          page_title: pageSettings.title,
          primary_color: pageSettings.primaryColor
        }
      });
      
      // Update all sections
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const pageSection = mapSectionToPageSection(section, i);
        
        if (pageSection.id) {
          // Update existing section
          await updateSection.mutateAsync({
            sectionId: pageSection.id,
            data: {
              section_content: pageSection.section_content,
              section_order: pageSection.section_order
            }
          });
        } else {
          // Create new section
          await updateSection.mutateAsync({
            pageId: ownerBusinessPage.id,
            data: {
              section_type: section.type,
              section_order: i,
              section_content: section.content || {}
            }
          });
        }
      }
      
      toast({
        title: "Changes saved",
        description: "Your page has been updated successfully"
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save changes"
      });
    }
  };
  
  // Handle publishing business page
  const handlePublish = async () => {
    try {
      if (!ownerBusinessPage) {
        throw new Error("No business page found");
      }
      
      // Save all changes first
      await handleSave();
      
      // Then publish the page
      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          is_published: true
        }
      });
      
      toast({
        title: "Page published",
        description: "Your business page is now live"
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: error instanceof Error ? error.message : "Failed to publish page"
      });
    }
  };
  
  // Update a section in the sections array
  const updateSectionInState = (index: number, updatedSection: SectionType) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      newSections[index] = updatedSection;
      return newSections;
    });
  };
  
  // Add a new section
  const addSection = (type: string) => {
    const newSection: SectionType = {
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      subtitle: "",
      layouts: ["default", "centered", "split"],
      activeLayout: "default",
      content: {}
    };
    
    setSections(prevSections => [...prevSections, newSection]);
    
    // Automatically select the new section for editing
    setActiveSectionIndex(sections.length);
  };
  
  // Remove a section
  const removeSection = (index: number) => {
    setSections(prevSections => prevSections.filter((_, i) => i !== index));
    
    // If removing the active section, clear active section
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    }
    // If removing a section before the active one, adjust active index
    else if (activeSectionIndex !== null && index < activeSectionIndex) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  // Move a section up in the order
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    
    setSections(prevSections => {
      const newSections = [...prevSections];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
      return newSections;
    });
    
    // If moving the active section, adjust active index
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index - 1);
    } else if (activeSectionIndex === index - 1) {
      setActiveSectionIndex(index);
    }
  };
  
  // Move a section down in the order
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    
    setSections(prevSections => {
      const newSections = [...prevSections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
      return newSections;
    });
    
    // If moving the active section, adjust active index
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };
  
  // Helper function to map section to BusinessPageSection
  const mapSectionToPageSection = (section: any, index: number): BusinessPageSection => {
    return {
      id: section.id || undefined,
      page_id: ownerBusinessPage?.id || "",
      section_type: section.type,
      section_order: index,
      section_content: section.content || {},
      is_visible: true,
      created_at: section.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };
  
  // Convert database sections to UI sections
  const convertDbSectionsToUiSections = useCallback((dbSections: BusinessPageSection[] | undefined): SectionType[] => {
    if (!dbSections) return [];
    
    return dbSections.map(section => ({
      id: section.id,
      type: section.section_type,
      title: section.section_content?.title || `${section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)} Section`,
      subtitle: section.section_content?.subtitle || "",
      layouts: ["default", "centered", "split"],
      activeLayout: section.section_content?.layout || "default",
      content: section.section_content || {}
    }));
  }, []);
  
  // Initial data loading
  useEffect(() => {
    if (pageSections && !sectionsLoading) {
      const sortedSections = [...pageSections].sort((a, b) => a.section_order - b.section_order);
      const uiSections = convertDbSectionsToUiSections(sortedSections);
      setSections(uiSections);
    }
  }, [pageSections, sectionsLoading, convertDbSectionsToUiSections]);
  
  // Initialize page settings from business page
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageSettings(prev => ({
        ...prev,
        title: ownerBusinessPage.page_title || "My Business Page",
        primaryColor: ownerBusinessPage.primary_color || "#3B82F6",
      }));
    }
  }, [ownerBusinessPage]);
  
  // Helper function to create a new page if none exists
  const createDefaultPage = async () => {
    try {
      await createPage.mutateAsync({
        title: "My Business Page",
        slug: generateSlug("My Business Page")
      });
      
      toast({
        title: "Business page created",
        description: "Your business page has been created successfully"
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create page"
      });
    }
  };
  
  // Helper function to generate a slug from a title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };
  
  if (isLoading || ownerPageLoading || sectionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If no business page exists yet, show create button
  if (!ownerBusinessPage && !ownerPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Create Your Business Page</h1>
        <p className="text-gray-500 max-w-md text-center">
          You don't have a business page yet. Create one to showcase your business 
          and services to your clients.
        </p>
        <Button 
          onClick={createDefaultPage} 
          disabled={createPage.isPending}
        >
          {createPage.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Create Business Page
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar 
        pageSettings={pageSettings}
        handleSave={handleSave}
        handlePublish={handlePublish}
        isSaving={updatePage.isPending}
        isPublishing={false}
        getPublicPageUrl={getPublicPageUrl}
      />
      
      <div className="flex flex-1 h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <PagePreview 
            sections={sections} 
            pageSettings={pageSettings}
            activeSection={activeSectionIndex !== null ? sections[activeSectionIndex] : null}
            onSectionClick={(index) => setActiveSectionIndex(index)}
          />
        </div>
        
        <EditorPanel 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sections={sections}
          pageSettings={pageSettings}
          setPageSettings={setPageSettings}
          activeSectionIndex={activeSectionIndex}
          updateSection={updateSectionInState}
          addSection={addSection}
          removeSection={removeSection}
          moveSectionUp={moveSectionUp}
          moveSectionDown={moveSectionDown}
          setActiveSectionIndex={setActiveSectionIndex}
        />
      </div>
    </div>
  );
};

export default SimplePageBuilder;
