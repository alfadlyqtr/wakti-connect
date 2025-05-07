
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./simple-builder/TopBar";
import PagePreview from "./simple-builder/PagePreview";
import EditorPanel from "./simple-builder/EditorPanel";
import { SectionType, PageSettings } from "./simple-builder/types";
import { useBusinessPage } from "@/hooks/business-page";
import { useToast } from "@/components/ui/use-toast";
import CreateBusinessPageForm from "./CreateBusinessPageForm";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";

// Default settings for a new page
const defaultPageSettings: PageSettings = {
  title: "My Business",
  theme: "light",
  primaryColor: "#0047AB",
  fontFamily: "Inter",
  businessHours: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: false },
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
    linkedin: "",
  },
  googleMapsUrl: "",
  tmwChatbotCode: "",
};

const SimplePageBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    ownerBusinessPage, 
    pageSections,
    updatePage,
    updateSection,
    createPage,
    getPublicPageUrl,
  } = useBusinessPage();
  
  // Local state for building the page
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>(defaultPageSettings);
  const [activeTab, setActiveTab] = useState("sections");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [pageData, setPageData] = useState<Partial<BusinessPage>>({
    page_title: "",
    description: "",
    primary_color: "#0047AB",
    secondary_color: "#FFFFFF",
  });
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Convert database sections to local format when data changes
  useEffect(() => {
    if (pageSections && pageSections.length > 0) {
      const mappedSections: SectionType[] = pageSections.map((section) => mapDatabaseSectionToLocal(section));
      setSections(mappedSections);
    }
  }, [pageSections]);
  
  // Update page settings from business page data
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageData({
        page_title: ownerBusinessPage.page_title,
        description: ownerBusinessPage.description,
        primary_color: ownerBusinessPage.primary_color,
        secondary_color: ownerBusinessPage.secondary_color,
      });
      
      // Also update the page settings
      setPageSettings((prev) => ({
        ...prev,
        title: ownerBusinessPage.page_title || "My Business",
        primaryColor: ownerBusinessPage.primary_color || "#0047AB",
      }));
    }
  }, [ownerBusinessPage]);
  
  // Map a database section to our local format
  const mapDatabaseSectionToLocal = (section: BusinessPageSection): SectionType => {
    const content = section.section_content || {};
    
    return {
      type: section.section_type,
      title: content.title || "",
      subtitle: content.subtitle || "",
      image: content.image_url || "",
      layouts: content.layouts || ["default"],
      activeLayout: content.active_layout || "default",
      content: content,
    };
  };
  
  // Map a local section to database format for saving
  const mapLocalSectionToDatabase = (section: SectionType, index: number): Partial<BusinessPageSection> => {
    return {
      section_type: section.type,
      section_order: index,
      section_content: {
        title: section.title,
        subtitle: section.subtitle,
        image_url: section.image,
        layouts: section.layouts,
        active_layout: section.activeLayout,
        ...section.content,
      },
      is_visible: true,
    };
  };
  
  // Handle section updates
  const handleSectionUpdate = async (index: number, updatedSection: SectionType) => {
    if (index < 0 || index >= sections.length) return;
    
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
    
    // If this is a database section, update it there too
    if (pageSections && pageSections[index]) {
      const dbSection = pageSections[index];
      const updatedData = mapLocalSectionToDatabase(updatedSection, index);
      
      try {
        await updateSection.mutateAsync({ 
          sectionId: dbSection.id,
          data: updatedData
        });
      } catch (error) {
        console.error("Error updating section:", error);
        toast({
          title: "Error updating section",
          description: "Your changes couldn't be saved. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Add a new section
  const handleAddSection = (type: string) => {
    const newSection: SectionType = {
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      subtitle: "",
      image: "",
      layouts: ["default"],
      activeLayout: "default",
      content: {},
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    setActiveSectionIndex(newSections.length - 1); // Focus the new section
  };
  
  // Remove a section
  const handleRemoveSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    
    // Clear active section if it was the removed one
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    }
    // Or adjust the active index if needed
    else if (activeSectionIndex !== null && activeSectionIndex > index) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  // Move a section up in the list
  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    setSections(newSections);
    
    // Update active section index if needed
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index - 1);
    } else if (activeSectionIndex === index - 1) {
      setActiveSectionIndex(index);
    }
  };
  
  // Move a section down in the list
  const handleMoveSectionDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
    
    // Update active section index if needed
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };
  
  // Handle page data changes (for create form)
  const handlePageDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData({
      ...pageData,
      [name]: value,
    });
  };
  
  // Handle page saving
  const handleSavePageSettings = async () => {
    setIsSaving(true);
    try {
      if (!ownerBusinessPage?.id) {
        // Create new page
        const createdPage = await createPage.mutateAsync({
          page_title: pageData.page_title,
          description: pageData.description,
          primary_color: pageData.primary_color,
          secondary_color: pageData.secondary_color,
        });
        
        if (createdPage) {
          toast({
            title: "Success",
            description: "Your business page has been created.",
          });
          // No need to navigate, we'll get the updated ownerBusinessPage from the query
        }
      } else {
        // Update existing page
        await updatePage.mutateAsync({ 
          pageId: ownerBusinessPage.id,
          data: {
            page_title: pageSettings.title,
            primary_color: pageSettings.primaryColor,
            // Add other fields as needed
          }
        });
        
        toast({
          title: "Success",
          description: "Your changes have been saved.",
        });
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: "Your changes couldn't be saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle publishing the page
  const handlePublishPage = async () => {
    if (!ownerBusinessPage?.id) {
      toast({
        title: "Error",
        description: "You need to create a page before publishing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      await updatePage.mutateAsync({ 
        pageId: ownerBusinessPage.id,
        data: {
          is_published: true,
        }
      });
      
      toast({
        title: "Success",
        description: "Your business page has been published.",
      });
      
      // Optionally navigate to the published page
      window.open(getPublicPageUrl(), '_blank');
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        title: "Error",
        description: "Your page couldn't be published. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Handle preview
  const handlePreviewPage = () => {
    if (!ownerBusinessPage?.page_slug) {
      toast({
        title: "Error",
        description: "Your page needs to be saved before preview.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(`/${ownerBusinessPage.page_slug}/preview`, '_blank');
  };
  
  return (
    <div className="flex flex-col h-screen">
      {!ownerBusinessPage ? (
        <CreateBusinessPageForm 
          pageData={pageData}
          handlePageDataChange={handlePageDataChange}
          createPage={createPage}
          handleSavePageSettings={handleSavePageSettings}
        />
      ) : (
        <>
          <TopBar
            pageUrl={getPublicPageUrl()}
            onPreview={handlePreviewPage}
            onPublish={handlePublishPage}
            onSave={handleSavePageSettings}
            isEditMode={isEditMode}
            setEditMode={setIsEditMode}
            pageSettings={pageSettings}
            isSaving={isSaving}
            isPublishing={isPublishing}
          />
          
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <PagePreview 
                sections={sections} 
                activeSectionIndex={activeSectionIndex}
                setActiveSectionIndex={setActiveSectionIndex}
                pageSettings={pageSettings}
                addSection={handleAddSection}
                onSectionClick={setActiveSectionIndex}
              />
            </div>
            
            <EditorPanel 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              sections={sections}
              pageSettings={pageSettings}
              setPageSettings={setPageSettings}
              activeSectionIndex={activeSectionIndex}
              updateSection={handleSectionUpdate}
              addSection={handleAddSection}
              removeSection={handleRemoveSection}
              moveSectionUp={handleMoveSectionUp}
              moveSectionDown={handleMoveSectionDown}
              setActiveSectionIndex={setActiveSectionIndex}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SimplePageBuilder;
