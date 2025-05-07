import React, { useState, useEffect } from "react";
import TopBar from "./simple-builder/TopBar";
import PagePreview from "./simple-builder/PagePreview";
import EditorPanel from "./simple-builder/EditorPanel";
import { SectionType, PageSettings } from "./simple-builder/types";
import { useBusinessPage } from "@/hooks/business-page";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SimplePageBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get business page data using our hook
  const {
    ownerBusinessPage,
    ownerPageLoading,
    pageSections,
    sectionsLoading,
    updatePage,
    updateSection,
    isLoading
  } = useBusinessPage();

  // Default page settings
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business Page",
    theme: "light",
    primaryColor: "#3B82F6", // Default blue
    fontFamily: "Inter, sans-serif",
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false },
    ],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      whatsapp: ""
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: ""
    },
    googleMapsUrl: "",
    tmwChatbotCode: "",
  });
  
  // Active section
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  
  // Active editor tab
  const [activeTab, setActiveTab] = useState("sections");
  
  // Sections state 
  const [sections, setSections] = useState<SectionType[]>([]);
  
  // Get page URL
  const pageUrl = ownerBusinessPage?.page_slug 
    ? `${window.location.origin}/business/${ownerBusinessPage.page_slug}` 
    : '#';
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(true);
  
  // Loading state for save/publish operations
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Load page settings from owner business page
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageSettings(prevSettings => ({
        ...prevSettings,
        title: ownerBusinessPage.page_title || prevSettings.title,
        primaryColor: ownerBusinessPage.primary_color || prevSettings.primaryColor,
        fontFamily: ownerBusinessPage.font_family || prevSettings.fontFamily,
        tmwChatbotCode: ownerBusinessPage.chatbot_code || prevSettings.tmwChatbotCode,
      }));
    }
  }, [ownerBusinessPage]);
  
  // Convert pageSections to our SectionType format
  useEffect(() => {
    if (pageSections && pageSections.length > 0) {
      const mappedSections = pageSections
        .sort((a, b) => a.section_order - b.section_order)
        .filter(section => section.is_visible)
        .map(section => ({
          type: section.section_type,
          title: section.section_content?.title || section.section_title || "",
          subtitle: section.section_content?.subtitle || "",
          image: section.section_content?.image || "",
          layouts: getLayoutsForSectionType(section.section_type),
          activeLayout: section.section_content?.activeLayout || "default",
          content: section.section_content || {}
        } as SectionType));
      
      setSections(mappedSections);
    } else if (!sectionsLoading && (!pageSections || pageSections.length === 0)) {
      // Add default header section if no sections exist
      setSections([{
        type: "header",
        title: "Welcome to Our Business",
        subtitle: "We provide quality services",
        layouts: ["default", "centered", "withBackground"],
        activeLayout: "default",
        content: {}
      }]);
    }
  }, [pageSections, sectionsLoading]);
  
  // Helper to get available layouts for a section type
  const getLayoutsForSectionType = (type: string): string[] => {
    switch (type) {
      case "header": return ["default", "centered", "withBackground"];
      case "about": return ["imageLeft", "imageRight", "centered"];
      case "gallery": return ["grid", "masonry", "slider"];
      case "contact": return ["formLeft", "formRight", "centered"];
      case "hours": return ["simple", "detailed", "withBackground"];
      case "testimonials": return ["cards", "quotes", "slider"];
      case "booking": return ["simple", "detailed"];
      case "instagram": return ["grid", "carousel"];
      case "chatbot": return ["floating", "embedded"];
      default: return ["default"];
    }
  };
  
  // Handle section updates
  const updateSectionHandler = (index: number, updatedSection: SectionType) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
    
    // Only persist if we have a page ID and sections are from database
    if (ownerBusinessPage?.id && pageSections && pageSections[index]) {
      const sectionId = pageSections[index].id;
      
      // Map our SectionType back to database format
      updateSection.mutate({
        sectionId,
        data: {
          section_title: updatedSection.title,
          section_content: {
            ...updatedSection.content,
            title: updatedSection.title,
            subtitle: updatedSection.subtitle,
            image: updatedSection.image,
            activeLayout: updatedSection.activeLayout
          }
        }
      });
    }
  };
  
  // Add a new section
  const addSection = (type: string) => {
    const newSection: SectionType = {
      type,
      title: getDefaultTitleForType(type),
      subtitle: getDefaultSubtitleForType(type),
      layouts: getLayoutsForSectionType(type),
      activeLayout: "default",
      content: {}
    };
    
    // Add to local state first for immediate UI update
    const newSections = [...sections, newSection];
    setSections(newSections);
    
    // Create in database if we have a page ID
    if (ownerBusinessPage?.id) {
      const pageId = ownerBusinessPage.id;
      
      // Map our SectionType to database format
      const newOrder = pageSections ? pageSections.length : 0;
      
      updateSection.mutate({
        sectionId: "", // This will be ignored, backend will create a new one
        data: {
          page_id: pageId,
          section_type: type,
          section_order: newOrder,
          section_title: newSection.title,
          is_visible: true,
          section_content: {
            title: newSection.title,
            subtitle: newSection.subtitle,
            activeLayout: newSection.activeLayout
          }
        }
      }, {
        onSuccess: () => {
          // Refetch sections after successful creation
          // This will automatically update our UI through the useEffect
          toast({
            title: "Section added",
            description: `Added ${type} section successfully`,
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Failed to add section",
            description: error instanceof Error ? error.message : "An unknown error occurred",
          });
          // Remove from local state if database create failed
          setSections(sections);
        }
      });
    }
    
    // Automatically select the new section for editing
    setActiveSectionIndex(newSections.length - 1);
    setActiveTab("sections");
  };
  
  // Remove a section
  const removeSection = (index: number) => {
    const removedSection = sections[index];
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    
    // Remove from database if we have a page ID
    if (ownerBusinessPage?.id && pageSections && pageSections[index]) {
      const sectionId = pageSections[index].id;
      
      updateSection.mutate({
        sectionId,
        data: {
          is_visible: false
        }
      }, {
        onSuccess: () => {
          toast({
            title: "Section removed",
            description: `Removed ${removedSection.type} section successfully`,
          });
          // Clear active section if it was the one removed
          if (activeSectionIndex === index) {
            setActiveSectionIndex(null);
          } else if (activeSectionIndex && activeSectionIndex > index) {
            // Adjust active index
            setActiveSectionIndex(activeSectionIndex - 1);
          }
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Failed to remove section",
            description: error instanceof Error ? error.message : "An unknown error occurred",
          });
          // Restore section in local state if database delete failed
          setSections([...sections]);
        }
      });
    }
  };
  
  // Move section up
  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
      setSections(newSections);
      
      if (activeSectionIndex === index) {
        setActiveSectionIndex(index - 1);
      } else if (activeSectionIndex === index - 1) {
        setActiveSectionIndex(index);
      }
      
      // Update order in database
      if (ownerBusinessPage?.id && pageSections) {
        // This is a simplified approach - in a real implementation,
        // we would update the section_order of both affected sections
        // Keeping it simple for this demo
      }
    }
  };
  
  // Move section down
  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
      setSections(newSections);
      
      if (activeSectionIndex === index) {
        setActiveSectionIndex(index + 1);
      } else if (activeSectionIndex === index + 1) {
        setActiveSectionIndex(index);
      }
      
      // Update order in database
      if (ownerBusinessPage?.id && pageSections) {
        // This is a simplified approach - in a real implementation,
        // we would update the section_order of both affected sections
        // Keeping it simple for this demo
      }
    }
  };
  
  // Helper function to get default title for section type
  const getDefaultTitleForType = (type: string): string => {
    switch (type) {
      case "header": return "Welcome to Our Business";
      case "about": return "About Us";
      case "gallery": return "Our Gallery";
      case "contact": return "Contact Us";
      case "hours": return "Business Hours";
      case "testimonials": return "What Our Customers Say";
      case "booking": return "Book an Appointment";
      case "instagram": return "Follow Us on Instagram";
      case "chatbot": return "Chat with Us";
      default: return "New Section";
    }
  };
  
  // Helper function to get default subtitle for section type
  const getDefaultSubtitleForType = (type: string): string => {
    switch (type) {
      case "header": return "We provide quality services";
      case "about": return "Learn more about our business";
      case "gallery": return "View our work";
      case "contact": return "Get in touch with us";
      case "hours": return "When we're open";
      case "testimonials": return "Read reviews from our customers";
      case "booking": return "Schedule your appointment";
      case "instagram": return "See our latest posts";
      case "chatbot": return "Have questions? Chat with our AI assistant";
      default: return "Add your content here";
    }
  };
  
  // Handle save action
  const handleSave = async () => {
    if (!ownerBusinessPage) {
      toast({
        variant: "destructive",
        title: "No business page found",
        description: "Please create a business page first",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Update page settings
      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          page_title: pageSettings.title,
          primary_color: pageSettings.primaryColor,
          font_family: pageSettings.fontFamily,
          chatbot_code: pageSettings.tmwChatbotCode,
          // Add more fields as needed
        }
      });
      
      toast({
        title: "Page saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle preview action
  const handlePreview = () => {
    if (!ownerBusinessPage || !ownerBusinessPage.page_slug) {
      toast({
        variant: "destructive",
        title: "No business page found",
        description: "Please create and save a business page first",
      });
      return;
    }
    
    // Save first then open preview in new tab
    handleSave().then(() => {
      window.open(`/business/${ownerBusinessPage.page_slug}?preview=true`, '_blank');
    });
  };
  
  // Handle publish action
  const handlePublish = async () => {
    if (!ownerBusinessPage) {
      toast({
        variant: "destructive",
        title: "No business page found",
        description: "Please create a business page first",
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      // Save changes first
      await handleSave();
      
      // Update publish status
      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          is_published: true
        }
      });
      
      toast({
        title: "Page published",
        description: "Your page is now live and publicly accessible",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to publish",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  if (isLoading || ownerPageLoading || sectionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading your business page builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={pageUrl} 
        onPreview={handlePreview} 
        onPublish={handlePublish} 
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setIsEditMode}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-gray-50 overflow-auto">
          <PagePreview 
            sections={sections} 
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            pageSettings={pageSettings}
            addSection={addSection}
          />
        </div>
        
        {isEditMode && (
          <EditorPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sections={sections}
            pageSettings={pageSettings}
            setPageSettings={setPageSettings}
            activeSectionIndex={activeSectionIndex}
            updateSection={updateSectionHandler}
            addSection={addSection}
            removeSection={removeSection}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        )}
      </div>
    </div>
  );
};

export default SimplePageBuilder;
