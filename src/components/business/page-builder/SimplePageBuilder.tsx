
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/business-page";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import EditorPanel from "./simple-builder/EditorPanel";
import PagePreview from "./simple-builder/PagePreview";
import TopBar from "./simple-builder/TopBar";
import CreateBusinessPageForm from "./CreateBusinessPageForm";
import { SectionType, PageSettings } from "./simple-builder/types";
import { BusinessPageSection } from "@/types/business.types";

const initialPageSettings: PageSettings = {
  title: "My Business Page",
  theme: "default",
  primaryColor: "#3B82F6",
  fontFamily: "Inter, sans-serif",
  businessHours: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
    { day: "Sunday", hours: "Closed", isOpen: false }
  ],
  contactInfo: {
    email: "contact@business.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    whatsapp: ""
  },
  socialLinks: {
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: ""
  },
  googleMapsUrl: "",
  tmwChatbotCode: ""
};

const SimplePageBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sections");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState(initialPageSettings);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [isEditMode, setEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { 
    ownerBusinessPage, 
    ownerPageLoading, 
    pageSections,
    updatePage,
    updateSection,
    autoSavePage,
    getPublicPageUrl
  } = useBusinessPage();

  // Map database sections to our internal format when loaded
  useEffect(() => {
    if (pageSections && pageSections.length > 0) {
      const mappedSections = pageSections.map(mapPageSectionToSection);
      setSections(mappedSections);
    }
  }, [pageSections]);

  // Map business page settings when owner page is loaded
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageSettings(prev => ({
        ...prev,
        title: ownerBusinessPage.page_title || prev.title,
        primaryColor: ownerBusinessPage.primary_color || prev.primaryColor,
        fontFamily: ownerBusinessPage.font_family || prev.fontFamily,
      }));
    }
  }, [ownerBusinessPage]);

  const handleSectionUpdate = async (section: SectionType, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index] = section;
    setSections(updatedSections);
    
    if (ownerBusinessPage && pageSections && pageSections[index]) {
      try {
        const pageSection = pageSections[index];
        await updateSection.mutateAsync({ 
          sectionId: pageSection.id, 
          data: {
            section_type: section.type,
            section_content: section.content,
            section_order: index
          } 
        });
        toast({
          title: "Section updated",
          description: "Your changes have been saved successfully."
        });
      } catch (error) {
        console.error("Error updating section:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save section changes."
        });
      }
    }
  };

  const mapPageSectionToSection = (pageSection: BusinessPageSection): SectionType => {
    return {
      type: pageSection.section_type,
      title: pageSection.section_content?.title || "",
      subtitle: pageSection.section_content?.subtitle || "",
      image: pageSection.section_content?.image || "",
      layouts: pageSection.section_content?.layouts || ["default"],
      activeLayout: pageSection.section_content?.activeLayout || "default",
      content: pageSection.section_content || {}
    };
  };

  const addSection = (type: string) => {
    // Default content for new section based on type
    const newSection: SectionType = {
      type,
      title: `New ${type} Section`,
      subtitle: `This is a ${type} section`,
      layouts: ["default"],
      activeLayout: "default",
      content: {}
    };
    
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
  };
  
  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    } else if (activeSectionIndex && activeSectionIndex > index) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index - 1];
    updatedSections[index - 1] = updatedSections[index];
    updatedSections[index] = temp;
    
    setSections(updatedSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index - 1);
    } else if (activeSectionIndex === index - 1) {
      setActiveSectionIndex(index);
    }
  };
  
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    
    const updatedSections = [...sections];
    const temp = updatedSections[index + 1];
    updatedSections[index + 1] = updatedSections[index];
    updatedSections[index] = temp;
    
    setSections(updatedSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (ownerBusinessPage) {
        await updatePage.mutateAsync({
          pageId: ownerBusinessPage.id,
          data: {
            page_title: pageSettings.title,
            primary_color: pageSettings.primaryColor,
            font_family: pageSettings.fontFamily,
          }
        });
        
        toast({
          title: "Page saved",
          description: "Your page has been saved successfully."
        });
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your page."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (ownerBusinessPage) {
        await updatePage.mutateAsync({
          pageId: ownerBusinessPage.id,
          data: { 
            is_published: true
          }
        });
        
        toast({
          title: "Page published",
          description: "Your page is now live and accessible to the public."
        });
      }
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: "There was an error publishing your page."
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // If page not found, show create page form
  if (!ownerBusinessPage && !ownerPageLoading) {
    return <CreateBusinessPageForm />;
  }

  // If still loading, show loading state
  if (ownerPageLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-wakti-navy border-r-wakti-navy border-b-wakti-navy border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={getPublicPageUrl()} 
        onPreview={() => setEditMode(false)}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setEditMode}
      />
      
      {!isEditMode ? (
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="max-w-6xl mx-auto my-8 px-4">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a preview of your page. <button className="underline" onClick={() => setEditMode(true)}>Return to editor</button>
              </AlertDescription>
            </Alert>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <PagePreview 
                sections={sections}
                activeSectionIndex={activeSectionIndex}
                setActiveSectionIndex={setActiveSectionIndex}
                pageSettings={pageSettings}
                addSection={addSection}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-gray-100 overflow-auto">
            <PagePreview 
              sections={sections}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              pageSettings={pageSettings}
              addSection={addSection}
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
            addSection={addSection}
            removeSection={removeSection}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
            setActiveSectionIndex={setActiveSectionIndex}
          />
        </div>
      )}
    </div>
  );
};

export default SimplePageBuilder;
