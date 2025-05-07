
import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/business-page";
import TopBar from "./TopBar";
import { SectionType, PageSettings } from "./types";
import PagePreview from "./PagePreview";
import EditorPanel from "./EditorPanel";
import { toast } from "@/components/ui/use-toast";
import { BusinessPageSection } from "@/types/business.types";

const SimplePageBuilder = () => {
  // State for sections and editor configuration
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeTab, setActiveTab] = useState("sections");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Default page settings
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business Page",
    theme: "modern",
    primaryColor: "#3b82f6",
    fontFamily: "Inter",
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false }
    ],
    contactInfo: {
      email: "contact@yourbusiness.com",
      phone: "(555) 123-4567",
      address: "123 Business St, City, State 12345",
      whatsapp: "+15551234567"
    },
    socialLinks: {
      instagram: "https://instagram.com/yourbusiness",
      facebook: "https://facebook.com/yourbusiness",
      twitter: "https://twitter.com/yourbusiness",
      linkedin: "https://linkedin.com/company/yourbusiness"
    },
    googleMapsUrl: "https://maps.google.com/?q=yourbusiness",
    tmwChatbotCode: ""
  });

  // Business page API hooks
  const { ownerBusinessPage, pageSections, updateSection: apiUpdateSection, updatePage, createPage, getPublicPageUrl } = useBusinessPage();

  // Initialize page data from API
  useEffect(() => {
    if (ownerBusinessPage) {
      // Set page settings from API data
      console.log("Loaded owner business page:", ownerBusinessPage);
    }

    if (pageSections && pageSections.length > 0) {
      // Transform API sections to local state format
      const transformedSections: SectionType[] = pageSections.map(section => {
        const content = section.section_content || {};
        return {
          type: section.section_type,
          title: content.title || "",
          subtitle: content.subtitle || "",
          image: content.image || "",
          layouts: content.layouts || ["default"],
          activeLayout: content.activeLayout || "default",
          content: content
        };
      });

      setSections(transformedSections);
      console.log("Loaded page sections:", transformedSections);
    }
  }, [ownerBusinessPage, pageSections]);

  // Section management functions
  const updateSection = (index: number, section: SectionType) => {
    const newSections = [...sections];
    newSections[index] = section;
    setSections(newSections);

    // If connected to API, update the section
    if (pageSections && pageSections[index]) {
      const sectionId = pageSections[index].id;
      apiUpdateSection.mutate({
        sectionId,
        data: {
          section_content: section.content,
          section_type: section.type
        }
      });
    }
  };

  const addSection = (type: string) => {
    // Create a new section of the specified type with default content
    const newSection: SectionType = {
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      subtitle: "",
      layouts: ["default"],
      activeLayout: "default",
      content: {}
    };

    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length); // Select the newly added section
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    setActiveSectionIndex(null);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
    setActiveSectionIndex(index - 1);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
    setActiveSectionIndex(index + 1);
  };

  // Page actions
  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!ownerBusinessPage) {
        // Create new page if none exists
        await createPage.mutateAsync({
          page_title: pageSettings.title,
          page_slug: generateSlug(pageSettings.title),
          primary_color: pageSettings.primaryColor,
          font_family: pageSettings.fontFamily,
          is_published: false,
          business_id: "user_id_placeholder" // Should be replaced with actual business ID
        });
        toast({
          title: "Page created successfully",
          description: "Your page has been saved as a draft."
        });
      } else {
        // Update existing page
        await updatePage.mutateAsync({
          pageId: ownerBusinessPage.id,
          data: {
            page_title: pageSettings.title,
            primary_color: pageSettings.primaryColor,
            font_family: pageSettings.fontFamily
          }
        });
        toast({
          title: "Page saved successfully",
          description: "Your changes have been saved."
        });
      }
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Error saving page",
        description: "Please try again."
      });
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (!ownerBusinessPage) {
        toast({
          variant: "destructive",
          title: "Please save your page first",
          description: "Save your page as a draft before publishing."
        });
        setIsPublishing(false);
        return;
      }

      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          is_published: true
        }
      });

      toast({
        title: "Page published successfully",
        description: "Your page is now live."
      });
      setIsPublishing(false);
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error publishing page",
        description: "Please try again."
      });
      setIsPublishing(false);
    }
  };

  // Helper function to generate a URL slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  // UI rendering
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar with save/publish buttons */}
      <TopBar
        pageUrl={getPublicPageUrl()}
        onPreview={handlePreview}
        onPublish={() => {}}
        onSave={() => {}}
        isEditMode={!isPreviewMode}
        setEditMode={setIsPreviewMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
        getPublicPageUrl={getPublicPageUrl}
        handleSave={handleSave}
        handlePublish={handlePublish}
      />

      {/* Main content area with preview and editor panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Page preview */}
        <div className="flex-1 overflow-auto p-6">
          <PagePreview
            sections={sections}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            pageSettings={pageSettings}
            addSection={addSection}
            onSectionClick={(index) => setActiveSectionIndex(index)}
          />
        </div>

        {/* Editor panel */}
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
      </div>
    </div>
  );
};

export default SimplePageBuilder;
