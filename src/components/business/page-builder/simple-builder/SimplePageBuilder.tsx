
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/auth/useUser";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import TopBar from "./TopBar";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { SectionType, PageSettings, TextAlignment } from "./types";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";

const SimplePageBuilder: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("sections");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [isEditMode, setEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const defaultPageSettings: PageSettings = {
    title: "My Business Page",
    slug: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    description: "Welcome to my business page",
    isPublished: false,
    fontFamily: "Inter, sans-serif",
    textColor: "#333333",
    backgroundColor: "#FFFFFF",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      whatsapp: ""
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    },
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false }
    ],
    googleMapsUrl: "",
    tmwChatbotCode: "",
    textAlignment: "left",
    headingStyle: "default",
    buttonStyle: "default",
    sectionSpacing: "default",
    contentMaxWidth: "1200px"
  };
  
  const [pageSettings, setPageSettings] = useState<PageSettings>(defaultPageSettings);
  
  // Query for existing data
  const { data: existingPageData, isLoading: isLoadingData } = useBusinessPageDataQuery(user?.id);
  const createBusinessPageData = useCreateBusinessPageDataMutation();
  const updateBusinessPageData = useUpdateBusinessPageDataMutation();
  
  // Initialize with default sections if none exist
  useEffect(() => {
    if (!sections.length) {
      const defaultSections: SectionType[] = [
        {
          id: uuidv4(),
          type: "header",
          title: "Welcome to My Business",
          subtitle: "Professional services at your fingertips",
          content: {
            logoUrl: "",
            alignment: "center"
          },
          activeLayout: "default"
        }
      ];
      setSections(defaultSections);
    }
  }, [sections]);
  
  // Load existing data when available
  useEffect(() => {
    if (existingPageData && !isLoadingData) {
      const pageData = existingPageData.page_data;
      
      if (pageData) {
        // Load sections if available
        if (pageData.sections && Array.isArray(pageData.sections)) {
          setSections(pageData.sections);
        }
        
        // Load page settings if available
        if (pageData.settings) {
          setPageSettings({
            ...defaultPageSettings,
            ...pageData.settings
          });
        }
      }
    }
  }, [existingPageData, isLoadingData]);
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to save your page",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const pageData = {
        sections,
        settings: pageSettings
      };
      
      // If we have existing data, update it, otherwise create new
      if (existingPageData) {
        await updateBusinessPageData.mutateAsync({ 
          id: existingPageData.id, 
          pageData 
        });
      } else {
        await createBusinessPageData.mutateAsync({ 
          userId: user.id, 
          pageData 
        });
      }
      
      toast({
        title: "Page saved",
        description: "Your page has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your page",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to publish your page",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure we have a slug
    if (!pageSettings.slug) {
      // Generate a slug from the title
      const newSlug = pageSettings.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
        
      setPageSettings({
        ...pageSettings,
        slug: newSlug
      });
    }
    
    setIsPublishing(true);
    
    try {
      const updatedSettings = {
        ...pageSettings,
        isPublished: true
      };
      
      setPageSettings(updatedSettings);
      
      const pageData = {
        sections,
        settings: updatedSettings
      };
      
      // If we have existing data, update it, otherwise create new
      if (existingPageData) {
        await updateBusinessPageData.mutateAsync({ 
          id: existingPageData.id, 
          pageData 
        });
      } else {
        await createBusinessPageData.mutateAsync({ 
          userId: user.id, 
          pageData 
        });
      }
      
      toast({
        title: "Page published",
        description: `Your page is now live at ${pageSettings.slug}.wakti.app`,
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        title: "Failed to publish",
        description: "There was an error publishing your page",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handlePreview = () => {
    setEditMode(false);
    toast({
      title: "Preview mode",
      description: "You are now viewing your page as visitors will see it",
    });
  };
  
  const addSection = (type: string) => {
    const newSection: SectionType = {
      id: uuidv4(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      subtitle: "",
      description: "",
      content: {},
      activeLayout: "default"
    };
    
    if (type === "header") {
      newSection.content = { 
        logoUrl: "", 
        alignment: "center" as TextAlignment 
      };
    } else if (type === "booking") {
      newSection.content = { 
        templates: [], 
        viewStyle: "grid" 
      };
    } else if (type === "hours") {
      newSection.content = { 
        hours: [...pageSettings.businessHours] 
      };
    } else if (type === "social") {
      newSection.content = { 
        platforms: { 
          facebook: pageSettings.socialLinks.facebook || false,
          instagram: pageSettings.socialLinks.instagram || false,
          twitter: pageSettings.socialLinks.twitter || false,
          linkedin: pageSettings.socialLinks.linkedin || false
        } 
      };
    } else if (type === "chatbot") {
      newSection.content = { 
        embedCode: pageSettings.tmwChatbotCode || ""
      };
    }
    
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
  };
  
  const updateSection = (index: number, section: SectionType) => {
    const updatedSections = [...sections];
    updatedSections[index] = section;
    setSections(updatedSections);
  };
  
  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
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
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    
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
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    
    setSections(updatedSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };
  
  const pageUrl = pageSettings.slug ? `https://${pageSettings.slug}.wakti.app` : 'URL will be generated when published';

  // Loading state
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl font-medium">Loading your page builder...</p>
          <p className="text-gray-500">Please wait while we load your data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <TopBar 
        pageUrl={pageUrl}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <PagePreview 
            sections={sections}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            addSection={addSection}
            pageSettings={pageSettings}
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
            updateSection={updateSection}
            addSection={addSection}
            removeSection={removeSection}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
            setActiveSectionIndex={setActiveSectionIndex}
          />
        )}
      </div>
    </div>
  );
};

export default SimplePageBuilder;
