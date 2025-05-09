
import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import SimpleLoading from "./SimpleLoading";
import { v4 as uuidv4 } from "uuid";
import { PageSettings, SectionType, BusinessPageData } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/auth/useUser";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { 
  useCreateBusinessPageDataMutation,
  useUpdateBusinessPageDataMutation
} from "@/hooks/business-page/useBusinessPageDataMutations";
import { generateSlug } from "@/utils/string-utils";

// Default page settings
const defaultPageSettings: PageSettings = {
  title: "My Business Landing Page",
  slug: "",
  primaryColor: "#1a365d",
  secondaryColor: "#7f9cf5",
  description: "Welcome to my business landing page.",
  isPublished: false,
  fontFamily: "system-ui, -apple-system, sans-serif",
  textColor: "#333333",
  backgroundColor: "#ffffff",
  contactInfo: {
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  },
  businessHours: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Saturday", hours: "Closed", isOpen: false },
    { day: "Sunday", hours: "Closed", isOpen: false },
  ],
  googleMapsUrl: "",
  tmwChatbotCode: "",
  textAlignment: "left",
  headingStyle: "default",
  buttonStyle: "default",
  sectionSpacing: "default",
  contentMaxWidth: "1200px",
};

// Default business page data
const createDefaultBusinessPageData = (businessName = "My Business"): BusinessPageData => ({
  pageSetup: {
    businessName,
    alignment: "center",
    visible: true,
  },
  logo: {
    url: "",
    shape: "circle",
    alignment: "center",
    visible: true,
  },
  bookings: {
    viewStyle: "grid",
    templates: [],
    visible: true,
  },
  socialInline: {
    style: "icon",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: true,
  },
  workingHours: {
    layout: "card",
    hours: [],
    visible: true,
  },
  chatbot: {
    position: "right",
    embedCode: "",
    visible: false,
  },
  theme: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontStyle: "sans-serif",
  },
  socialSidebar: {
    position: "right",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: false,
  },
  contactInfo: {
    email: "",
    whatsapp: "",
    whatsappBusiness: "",
    phone: "",
    facebook: "",
    googleMaps: "",
    instagram: "",
  },
  sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
  published: false,
  pageSlug: "", // Add pageSlug with an empty default
});

// Function to convert context BusinessPageData to our format
const convertBusinessPageData = (data: any): BusinessPageData => ({
  pageSetup: data.pageSetup || {
    businessName: "My Business",
    alignment: "center",
    visible: true,
  },
  logo: {
    ...data.logo,
    alignment: data.logo?.alignment || "center", // Ensure alignment is text
  },
  bookings: data.bookings || {
    viewStyle: "grid",
    templates: [],
    visible: true,
  },
  socialInline: data.socialInline || {
    style: "icon",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: true,
  },
  workingHours: {
    layout: data.workingHours?.layout || "card",
    hours: data.workingHours?.hours?.map((hour: any) => ({
      day: hour.day,
      hours: hour.open && hour.close ? `${hour.open} - ${hour.close}` : "Closed",
      isOpen: !hour.closed,
    })) || [],
    visible: data.workingHours?.visible || true,
  },
  chatbot: data.chatbot || {
    position: "right",
    embedCode: "",
    visible: false,
  },
  theme: data.theme || {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontStyle: "sans-serif",
  },
  socialSidebar: data.socialSidebar || {
    position: "right",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: false,
  },
  contactInfo: data.contactInfo || {},
  sectionOrder: data.sectionOrder || ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
  published: data.published || false,
  pageSlug: data.pageSlug || "", // Preserve pageSlug or default to empty
  pageUrl: data.pageUrl,
});

const Builder: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  
  // State for sections, settings, editing
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>(defaultPageSettings);
  const [activeTab, setActiveTab] = useState("sections");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [pageData, setPageData] = useState<BusinessPageData>(createDefaultBusinessPageData());
  
  // Fetch existing page data
  const { 
    data: existingPageData,
    isLoading: isLoadingPageData,
    error: pageDataError
  } = useBusinessPageDataQuery(userId);

  // Setup mutations
  const createPageMutation = useCreateBusinessPageDataMutation();
  const updatePageMutation = useUpdateBusinessPageDataMutation();
  
  // Initialize and load existing data
  useEffect(() => {
    if (isLoadingPageData || !userId) return;
    
    if (existingPageData) {
      // We have existing data, set it
      const pageData = existingPageData.page_data;
      
      // Set page settings from the existing data
      const newPageSettings = {
        ...defaultPageSettings,
        title: pageData.pageSetup?.businessName || "My Business",
        description: pageData.pageSetup?.description || "",
        backgroundColor: pageData.theme?.backgroundColor || "#ffffff",
        textColor: pageData.theme?.textColor || "#000000",
        fontFamily: pageData.theme?.fontStyle || "system-ui",
        isPublished: !!pageData.published,
        slug: existingPageData.page_slug || generateSlug(pageData.pageSetup?.businessName || "my-business"),
      };
      
      setPageSettings(newPageSettings);
      
      // Convert and set the page data
      const convertedData = convertBusinessPageData(pageData);
      convertedData.pageSlug = existingPageData.page_slug || ""; // Ensure pageSlug is set from DB
      setPageData(convertedData);
      
      console.log("Loaded existing page data:", convertedData);
    } else {
      // No existing data, set defaults
      console.log("No existing page data, using defaults");
      setPageData(createDefaultBusinessPageData());
      
      // Generate a slug for the page settings
      if (!pageSettings.slug && user?.user_metadata?.business_name) {
        const newSlug = generateSlug(user.user_metadata.business_name);
        setPageSettings(prev => ({
          ...prev,
          title: user.user_metadata.business_name,
          slug: newSlug
        }));
        
        // Update page data with business name
        setPageData(prev => ({
          ...prev,
          pageSetup: {
            ...prev.pageSetup,
            businessName: user.user_metadata.business_name || "My Business",
          },
          pageSlug: newSlug
        }));
      }
    }
    
  }, [existingPageData, isLoadingPageData, userId, user]);
  
  // Update section data
  const updateSection = (index: number, updatedSection: SectionType) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[index] = updatedSection;
      return newSections;
    });
  };
  
  // Add a new section
  const addSection = (type: string) => {
    const newSection: SectionType = {
      id: uuidv4(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: {},
      activeLayout: "default",
    };
    
    setSections(prev => [...prev, newSection]);
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
  };
  
  // Update a specific section in the pageData
  const handleUpdateSection = (sectionKey: string, newSectionData: any) => {
    setPageData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey as keyof typeof prev],
        ...newSectionData
      }
    }));
  };
  
  // Remove a section
  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
    setActiveSectionIndex(null);
  };
  
  // Move section up
  const moveSectionUp = (index: number) => {
    if (index > 0) {
      setSections(prev => {
        const newSections = [...prev];
        const temp = newSections[index - 1];
        newSections[index - 1] = newSections[index];
        newSections[index] = temp;
        return newSections;
      });
      
      setActiveSectionIndex(index - 1);
    }
  };
  
  // Move section down
  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      setSections(prev => {
        const newSections = [...prev];
        const temp = newSections[index + 1];
        newSections[index + 1] = newSections[index];
        newSections[index] = temp;
        return newSections;
      });
      
      setActiveSectionIndex(index + 1);
    }
  };
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };
  
  // Save the page
  const handleSave = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to save your page.",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Make sure the slug is set in both pageData and pageSettings
      const updatedPageData = {
        ...pageData,
        pageSetup: {
          ...pageData.pageSetup,
          businessName: pageSettings.title || pageData.pageSetup.businessName,
        },
        pageSlug: pageSettings.slug || generateSlug(pageSettings.title)
      };
      
      if (existingPageData?.id) {
        // Update existing page
        await updatePageMutation.mutateAsync({
          id: existingPageData.id,
          pageData: updatedPageData,
        });
        
        toast({
          title: "Page saved",
          description: "Your page has been saved successfully.",
        });
      } else {
        // Create a new page
        await createPageMutation.mutateAsync({
          userId,
          pageData: updatedPageData,
        });
        
        toast({
          title: "Page created",
          description: "Your page has been created successfully.",
        });
      }
      
      // Update local state with saved changes
      setPageData(updatedPageData);
      
    } catch (error: any) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "An error occurred while saving your page.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Publish the page
  const handlePublish = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to publish your page.",
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      // Update the published state
      const updatedPageData = {
        ...pageData,
        published: true,
        pageSlug: pageSettings.slug || generateSlug(pageSettings.title)
      };
      
      if (existingPageData?.id) {
        // Update existing page
        await updatePageMutation.mutateAsync({
          id: existingPageData.id,
          pageData: updatedPageData,
        });
      } else {
        // Create a new page
        await createPageMutation.mutateAsync({
          userId,
          pageData: updatedPageData,
        });
      }
      
      // Update local state with published changes
      setPageData(updatedPageData);
      setPageSettings(prev => ({ ...prev, isPublished: true }));
      
      toast({
        title: "Page published",
        description: "Your page has been published successfully.",
      });
    } catch (error: any) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: error.message || "An error occurred while publishing your page.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate the page URL
  const getPageUrl = () => {
    if (!pageSettings.slug) return "";
    return `https://wakti.qa/${pageSettings.slug}`;
  };
  
  if (isLoadingPageData) {
    return <SimpleLoading />;
  }
  
  if (pageDataError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Error Loading Page Data</h3>
          <p className="text-gray-600">
            There was a problem loading your page data. Please try refreshing.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={getPageUrl()}
        onPreview={handleToggleEditMode}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setIsEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 p-4">
          {isEditMode ? (
            <PagePreview
              sections={sections}
              activeSection={sections[activeSectionIndex as number]}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              addSection={addSection}
              pageSettings={pageSettings}
              pageData={pageData}
              isEditMode={true}
            />
          ) : (
            <PagePreview
              pageData={pageData}
              isEditMode={false}
              pageSettings={pageSettings}
            />
          )}
        </div>
        
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
          pageData={pageData}
          onSectionUpdate={handleUpdateSection}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Builder;
