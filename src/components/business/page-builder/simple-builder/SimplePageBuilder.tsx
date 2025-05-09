
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth/index";
import { toast } from "@/components/ui/use-toast";
import TopBar from "./TopBar";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { SectionType, PageSettings } from "./types";
import { useCreateBusinessPageDataMutation, useBusinessPageDataQuery, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";

const SimplePageBuilder: React.FC = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("sections");
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Get existing page data if it exists
  const {
    data: pageData,
    isLoading,
    refetch
  } = useBusinessPageDataQuery(user?.id || undefined);
  
  // Mutations for creating and updating page data
  const createPageMutation = useCreateBusinessPageDataMutation();
  const updatePageMutation = useUpdateBusinessPageDataMutation();
  
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business Page",
    slug: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    description: "",
    isPublished: false,
    fontFamily: "Inter",
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
      { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: false },
      { day: "Sunday", hours: "Closed", isOpen: false }
    ],
    googleMapsUrl: "",
    tmwChatbotCode: ""
  });
  
  // Initialize with default sections for a new page
  useEffect(() => {
    if (!isLoading && !pageData && sections.length === 0) {
      setSections([
        {
          id: "header-" + Date.now(),
          type: "header",
          title: "Business Name",
          subtitle: "Your tagline goes here",
          content: {
            logoUrl: "",
            alignment: "center"
          },
          activeLayout: "default"
        },
        {
          id: "booking-" + Date.now(),
          type: "booking",
          title: "Our Services",
          subtitle: "Book your appointment today",
          content: {
            displayType: "grid",
            templates: []
          },
          activeLayout: "grid"
        },
        {
          id: "hours-" + Date.now(),
          type: "hours",
          title: "Business Hours",
          subtitle: "When you can visit us",
          content: {},
          activeLayout: "standard"
        },
        {
          id: "social-" + Date.now(),
          type: "social",
          title: "Connect With Us",
          subtitle: "",
          content: {},
          activeLayout: "horizontal"
        }
      ]);
    } else if (!isLoading && pageData) {
      // If we have existing page data, load it
      try {
        // Load page settings
        const data = pageData.page_data;
        if (data) {
          setPageSettings(prev => ({
            ...prev,
            title: data.pageSetup?.businessName || prev.title,
            slug: pageData.page_slug || "",
            isPublished: !!data.published,
            primaryColor: data.theme?.backgroundColor || prev.primaryColor,
            textColor: data.theme?.textColor || prev.textColor,
            fontFamily: data.theme?.fontStyle || prev.fontFamily,
            tmwChatbotCode: data.chatbot?.embedCode || ""
          }));
          
          // Create sections based on the loaded data
          const newSections: SectionType[] = [];
          
          // Header section
          newSections.push({
            id: "header-1",
            type: "header",
            title: data.pageSetup?.businessName || "Business Name",
            subtitle: "Your tagline goes here",
            content: {
              logoUrl: data.logo?.url || "",
              alignment: data.pageSetup?.alignment || "center"
            },
            activeLayout: "default"
          });
          
          // Booking section
          newSections.push({
            id: "booking-1",
            type: "booking",
            title: "Our Services",
            subtitle: "Book your appointment today",
            content: {
              displayType: data.bookings?.viewStyle || "grid",
              templates: data.bookings?.templates || []
            },
            activeLayout: data.bookings?.viewStyle || "grid"
          });
          
          // Hours section
          newSections.push({
            id: "hours-1",
            type: "hours",
            title: "Business Hours",
            subtitle: "When you can visit us",
            content: {
              hours: data.workingHours?.hours || []
            },
            activeLayout: "standard"
          });
          
          // Social section
          newSections.push({
            id: "social-1",
            type: "social",
            title: "Connect With Us",
            subtitle: "",
            content: {
              platforms: data.socialInline?.platforms || {
                whatsapp: false,
                facebook: false,
                instagram: false,
                email: false,
                phone: false
              }
            },
            activeLayout: "horizontal"
          });
          
          // Set the loaded sections
          setSections(newSections);
        }
      } catch (error) {
        console.error("Error parsing page data:", error);
        toast({
          variant: "destructive",
          title: "Error loading page data",
          description: "Could not load your page data properly."
        });
      }
    }
  }, [isLoading, pageData]);
  
  // Function to update a specific section
  const updateSection = (index: number, section: SectionType) => {
    const updatedSections = [...sections];
    updatedSections[index] = section;
    setSections(updatedSections);
  };
  
  // Function to add a new section
  const addSection = (type: string) => {
    // Create new section with empty default content
    const newSection: SectionType = {
      id: `${type}-${Date.now()}`,
      type,
      title: "",
      subtitle: "",
      description: "",
      content: {},
      activeLayout: type === 'header' ? 'default' : 'standard'
    };
    
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
  };
  
  // Function to remove a section
  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    } else if (activeSectionIndex !== null && activeSectionIndex > index) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  // Functions to move sections up and down
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
  
  // Convert the sections to the format needed for the API
  const prepareSaveData = () => {
    // Create the basic structure
    const saveData = {
      pageSetup: {
        businessName: pageSettings.title,
        alignment: "center",
        visible: true
      },
      logo: { url: "", shape: "circle", alignment: "center", visible: true },
      bookings: { viewStyle: "grid", templates: [], visible: true },
      socialInline: { 
        style: "icon", 
        platforms: {
          whatsapp: false,
          whatsappBusiness: false,
          facebook: false,
          instagram: false,
          googleMaps: false,
          phone: false,
          email: false
        },
        visible: true
      },
      workingHours: { 
        layout: "card", 
        hours: [], 
        visible: true
      },
      chatbot: { 
        position: "right", 
        embedCode: pageSettings.tmwChatbotCode || "", 
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
        phone: pageSettings.contactInfo.phone,
        facebook: pageSettings.socialLinks.facebook,
        googleMaps: pageSettings.googleMapsUrl,
        instagram: pageSettings.socialLinks.instagram
      },
      sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
      published: pageSettings.isPublished
    };
    
    // Update data based on sections
    sections.forEach(section => {
      if (section.type === "header") {
        saveData.pageSetup.businessName = section.title;
        if (section.content.alignment) {
          saveData.pageSetup.alignment = section.content.alignment;
        }
        if (section.content.logoUrl) {
          saveData.logo.url = section.content.logoUrl;
        }
      }
      else if (section.type === "booking") {
        saveData.bookings.viewStyle = (section.content.displayType || "grid") as any;
        saveData.bookings.templates = section.content.templates || [];
      }
      else if (section.type === "hours") {
        saveData.workingHours.hours = section.content.hours || [];
      }
      else if (section.type === "social") {
        if (section.content.platforms) {
          saveData.socialInline.platforms = {
            ...saveData.socialInline.platforms,
            ...section.content.platforms
          };
        }
      }
    });
    
    return saveData;
  };
  
  // Handle save functionality
  const handleSave = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save your page"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const saveData = prepareSaveData();
      
      if (pageData) {
        // Update existing page
        await updatePageMutation.mutateAsync({
          id: pageData.id,
          pageData: saveData
        });
      } else {
        // Create new page
        await createPageMutation.mutateAsync({
          userId: user.id,
          pageData: saveData
        });
        refetch(); // Refetch to get the new page data with ID
      }
      
      toast({
        title: "Changes saved",
        description: "Your page has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your page. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle preview mode
  const handlePreview = () => {
    setIsEditMode(false);
    toast({
      title: "Preview mode",
      description: "You are now previewing your page",
    });
  };
  
  // Handle publish functionality
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const saveData = prepareSaveData();
      saveData.published = true;
      
      if (pageData) {
        // Update existing page
        await updatePageMutation.mutateAsync({
          id: pageData.id,
          pageData: saveData
        });
        
        setPageSettings(prev => ({
          ...prev,
          isPublished: true
        }));
        
        toast({
          title: "Page published",
          description: "Your page is now live",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You need to save your page before publishing.",
        });
      }
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish your page. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Generate page URL
  const pageUrl = pageSettings.isPublished && pageSettings.slug 
    ? `https://${pageSettings.slug}.wakti.app` 
    : '#';
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your page builder...</p>
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
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <PagePreview 
            sections={sections}
            activeSection={activeSectionIndex !== null ? sections[activeSectionIndex] : undefined}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            addSection={addSection}
            pageSettings={pageSettings}
          />
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
        />
      </div>
    </div>
  );
};

export default SimplePageBuilder;
