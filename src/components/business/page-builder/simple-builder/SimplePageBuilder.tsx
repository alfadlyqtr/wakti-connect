
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/hooks/auth/useUser";
import { useToast } from "@/hooks/use-toast";
import TopBar from "./TopBar";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { SectionType, PageSettings } from "./types";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";

const SimplePageBuilder: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  // States for sections and page settings
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business",
    slug: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    description: "Welcome to my business page",
    isPublished: false,
    fontFamily: "sans-serif",
    textColor: "#000000",
    backgroundColor: "#ffffff",
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
  });
  
  const [activeTab, setActiveTab] = useState("sections");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Query existing data
  const { data: pageData, isLoading } = useBusinessPageDataQuery(user?.id);

  // Mutations for creating and updating data
  const createPageMutation = useCreateBusinessPageDataMutation();
  const updatePageMutation = useUpdateBusinessPageDataMutation();
  
  // Load existing data or initialize with default values
  useEffect(() => {
    if (pageData) {
      // Initialize with the data from the database
      const defaultSections: SectionType[] = [
        {
          id: uuidv4(),
          type: "header",
          title: pageData.page_data?.pageSetup?.businessName || "My Business",
          subtitle: "Welcome to my business",
          content: { logoUrl: pageData.page_data?.logo?.url || "" },
          activeLayout: "default"
        }
      ];
      
      setSections(pageData.page_data?.sections || defaultSections);
      
      // We need to map our BusinessPageData to our PageSettings format
      if (pageData.page_data) {
        setPageSettings({
          title: pageData.page_data.pageSetup?.businessName || "My Business",
          slug: pageData.page_slug || "",
          primaryColor: pageData.page_data.theme?.backgroundColor || "#4f46e5",
          secondaryColor: "#10b981",
          description: "Welcome to my business page",
          isPublished: pageData.page_data.published || false,
          fontFamily: pageData.page_data.theme?.fontStyle || "sans-serif",
          textColor: pageData.page_data.theme?.textColor || "#000000",
          backgroundColor: pageData.page_data.theme?.backgroundColor || "#ffffff",
          contactInfo: {
            email: pageData.page_data.contactInfo?.email || "",
            phone: pageData.page_data.contactInfo?.phone || "",
            address: "",
            whatsapp: pageData.page_data.contactInfo?.whatsapp || ""
          },
          socialLinks: {
            facebook: pageData.page_data.contactInfo?.facebook || "",
            instagram: pageData.page_data.contactInfo?.instagram || "",
            twitter: "",
            linkedin: ""
          },
          businessHours: pageData.page_data.workingHours?.hours || [
            { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
            { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
            { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
            { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
            { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
            { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
            { day: "Sunday", hours: "Closed", isOpen: false }
          ],
          googleMapsUrl: pageData.page_data.contactInfo?.googleMaps || "",
          tmwChatbotCode: pageData.page_data.chatbot?.embedCode || "",
          textAlignment: "left",
          headingStyle: "default",
          buttonStyle: "default",
          sectionSpacing: "default",
          contentMaxWidth: "1200px"
        });
      }
    }
  }, [pageData]);
  
  // Get active section if any
  const activeSection = activeSectionIndex !== null ? sections[activeSectionIndex] : undefined;
  
  // Update section in the array
  const updateSection = (index: number, section: SectionType) => {
    const newSections = [...sections];
    newSections[index] = section;
    setSections(newSections);
  };
  
  // Add a new section of the specified type
  const addSection = (type: string) => {
    const newSection: SectionType = {
      id: uuidv4(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: {},
      activeLayout: "default",
    };
    
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
  };
  
  // Remove a section from the array
  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    setActiveSectionIndex(null);
  };
  
  // Move section up in the order
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setSections(newSections);
    setActiveSectionIndex(index - 1);
  };
  
  // Move section down in the order
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setSections(newSections);
    setActiveSectionIndex(index + 1);
  };
  
  // Handle save operation
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to save your page",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Convert our current data format to the BusinessPageData expected by the API
      const businessPageData = {
        pageSetup: {
          businessName: pageSettings.title,
          alignment: "center",
          visible: true
        },
        logo: { 
          url: sections.find(s => s.type === "header")?.content?.logoUrl || "",
          shape: "circle", 
          alignment: "center", 
          visible: true 
        },
        bookings: { 
          viewStyle: "grid", 
          templates: [], 
          visible: true 
        },
        socialInline: { 
          style: "icon", 
          platforms: {
            whatsapp: !!pageSettings.contactInfo.whatsapp,
            facebook: !!pageSettings.socialLinks.facebook,
            instagram: !!pageSettings.socialLinks.instagram,
            googleMaps: !!pageSettings.googleMapsUrl,
            phone: !!pageSettings.contactInfo.phone,
            email: !!pageSettings.contactInfo.email,
            whatsappBusiness: false
          },
          visible: true
        },
        workingHours: { 
          layout: "card", 
          hours: pageSettings.businessHours, 
          visible: true
        },
        chatbot: { 
          position: "right", 
          embedCode: pageSettings.tmwChatbotCode, 
          visible: !!pageSettings.tmwChatbotCode
        },
        theme: {
          backgroundColor: pageSettings.backgroundColor,
          textColor: pageSettings.textColor,
          fontStyle: pageSettings.fontFamily
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
            email: false
          },
          visible: false
        },
        contactInfo: {
          email: pageSettings.contactInfo.email,
          whatsapp: pageSettings.contactInfo.whatsapp,
          whatsappBusiness: "",
          phone: pageSettings.contactInfo.phone,
          facebook: pageSettings.socialLinks.facebook,
          googleMaps: pageSettings.googleMapsUrl,
          instagram: pageSettings.socialLinks.instagram
        },
        sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
        published: pageSettings.isPublished,
        // Add the sections array
        sections: sections
      };
      
      if (pageData) {
        // Update existing page
        await updatePageMutation.mutateAsync({
          id: pageData.id,
          pageData: businessPageData
        });
      } else if (user?.id) {
        // Create new page
        await createPageMutation.mutateAsync({
          userId: user.id,
          pageData: businessPageData
        });
      }
      
      toast({
        title: "Saved successfully",
        description: "Your business page has been saved",
      });
    } catch (error) {
      console.error("Error saving business page:", error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your business page",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle publish operation
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Update isPublished flag in settings
      const updatedSettings = {
        ...pageSettings,
        isPublished: true
      };
      setPageSettings(updatedSettings);
      
      // Then save
      await handleSave();
      
      toast({
        title: "Published successfully",
        description: "Your business page is now live",
      });
    } catch (error) {
      console.error("Error publishing business page:", error);
      toast({
        title: "Failed to publish",
        description: "There was an error publishing your business page",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Handle preview operation
  const handlePreview = () => {
    setEditMode(!editMode);
  };
  
  // Get the public URL of the business page
  const getPageUrl = () => {
    return `https://${pageSettings.slug || "your-business"}.wakti.app`;
  };
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your business page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={getPageUrl()}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={editMode}
        setEditMode={setEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-row flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <PagePreview 
            sections={sections}
            activeSection={activeSection}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            addSection={addSection}
            pageSettings={pageSettings}
          />
        </div>
        
        {editMode && (
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
