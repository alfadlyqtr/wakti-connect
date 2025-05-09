
import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import TopBar from "./TopBar";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { SectionType, PageSettings, BusinessPageData, TextAlignment } from "./types";
import { useUser } from "@/hooks/auth/useUser";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { toast } from "@/components/ui/use-toast";

const SimplePageBuilder: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  
  // State for sections and settings
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business",
    slug: "",
    description: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    isPublished: false,
    fontFamily: "sans-serif",
    textColor: "#000000",
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
    businessHours: [],
    googleMapsUrl: "",
    tmwChatbotCode: "",
    textAlignment: "left",
    headingStyle: "default",
    buttonStyle: "default",
    sectionSpacing: "default",
    contentMaxWidth: "1200px",
  });

  // State for active section and editor panel tab
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sections");
  
  // Queries and mutations for saving and loading data
  const { data: pageData, isLoading } = useBusinessPageDataQuery(userId);
  const createPageDataMutation = useCreateBusinessPageDataMutation();
  const updatePageDataMutation = useUpdateBusinessPageDataMutation();
  
  // Handle active section
  const activeSection = activeSectionIndex !== null ? sections[activeSectionIndex] : undefined;
  
  // Saving and loading state
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setEditMode] = useState(true);

  // Load data from backend
  useEffect(() => {
    if (pageData && !isLoading) {
      // Convert from database format to local state
      // Check if page_data exists and has the required properties
      const storedData = pageData.page_data as BusinessPageData;
      
      if (storedData) {
        // Extract sections if they exist
        const storedSections = storedData.sections || [];
        setSections(storedSections);
        
        // Convert from the database business hours format to our local format
        const businessHours = storedData.workingHours?.hours?.map((hour: any) => {
          if ('day' in hour && 'open' in hour && 'close' in hour && 'closed' in hour) {
            // If it's already in our format with open/close/closed
            return {
              day: hour.day,
              hours: hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`,
              isOpen: !hour.closed
            };
          } else if ('day' in hour && 'hours' in hour && 'isOpen' in hour) {
            // If it's already in the expected format
            return hour;
          } else {
            // Default fallback
            return {
              day: 'Unknown',
              hours: 'Unknown',
              isOpen: false
            };
          }
        }) || [];

        // Convert the stored data to page settings
        setPageSettings({
          title: storedData.pageSetup?.businessName || "My Business",
          slug: pageData.page_slug || "",
          description: "",
          primaryColor: storedData.theme?.backgroundColor || "#3B82F6",
          secondaryColor: "#10B981",
          isPublished: storedData.published || false,
          fontFamily: storedData.theme?.fontStyle || "sans-serif",
          textColor: storedData.theme?.textColor || "#000000",
          backgroundColor: storedData.theme?.backgroundColor || "#ffffff",
          contactInfo: {
            email: storedData.contactInfo?.email || "",
            phone: storedData.contactInfo?.phone || "",
            address: "",
            whatsapp: storedData.contactInfo?.whatsapp || "",
          },
          socialLinks: {
            facebook: storedData.contactInfo?.facebook || "",
            instagram: storedData.contactInfo?.instagram || "",
            twitter: "",
            linkedin: "",
          },
          businessHours: businessHours,
          googleMapsUrl: storedData.contactInfo?.googleMaps || "",
          tmwChatbotCode: storedData.chatbot?.embedCode || "",
          textAlignment: (storedData.pageSetup?.alignment as TextAlignment) || "left",
          headingStyle: "default",
          buttonStyle: "default", 
          sectionSpacing: "default",
          contentMaxWidth: "1200px",
        });
      }
    }
  }, [pageData, isLoading]);

  // Convert data for saving to database
  const prepareDataForSaving = () => {
    // Create default working hours if none exist
    const workingHours = pageSettings.businessHours.length > 0 
      ? pageSettings.businessHours.map(hour => ({
          day: hour.day,
          open: hour.isOpen ? hour.hours.split(' - ')[0] || '9:00' : '9:00',
          close: hour.isOpen ? hour.hours.split(' - ')[1] || '17:00' : '17:00',
          closed: !hour.isOpen
        }))
      : [
          { day: "Monday", open: "09:00", close: "17:00", closed: false },
          { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
          { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
          { day: "Thursday", open: "09:00", close: "17:00", closed: false },
          { day: "Friday", open: "09:00", close: "17:00", closed: false },
          { day: "Saturday", open: "10:00", close: "14:00", closed: true },
          { day: "Sunday", open: "10:00", close: "14:00", closed: true },
        ];
  
    const businessPageData: BusinessPageData = {
      pageSetup: {
        businessName: pageSettings.title,
        alignment: pageSettings.textAlignment as TextAlignment || 'left',
        visible: true
      },
      logo: {
        url: pageSettings.contactInfo.whatsapp || "",
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
          whatsappBusiness: false,
          facebook: !!pageSettings.socialLinks.facebook,
          instagram: !!pageSettings.socialLinks.instagram,
          googleMaps: !!pageSettings.googleMapsUrl,
          phone: !!pageSettings.contactInfo.phone,
          email: !!pageSettings.contactInfo.email
        },
        visible: true
      },
      workingHours: {
        layout: "card",
        hours: workingHours,
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
      sections: sections
    };

    return businessPageData;
  };
  
  // Save page data
  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const businessPageData = prepareDataForSaving();
      
      if (pageData) {
        await updatePageDataMutation.mutateAsync({
          id: pageData.id,
          user_id: userId,
          page_data: businessPageData,
          page_slug: pageSettings.slug
        });
      } else {
        await createPageDataMutation.mutateAsync({
          user_id: userId,
          page_data: businessPageData,
          page_slug: pageSettings.slug || generateSlug(pageSettings.title)
        });
      }
      
      toast({
        title: "Success",
        description: "Page saved successfully.",
      });
    } catch (err) {
      console.error("Error saving page:", err);
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Publish page
  const handlePublish = async () => {
    if (!pageSettings.slug) {
      toast({
        title: "Error",
        description: "Please set a URL slug before publishing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      // Update local state
      setPageSettings((prev) => ({
        ...prev,
        isPublished: true,
      }));
      
      // Save with published flag
      const businessPageData = prepareDataForSaving();
      businessPageData.published = true;
      
      if (pageData) {
        await updatePageDataMutation.mutateAsync({
          id: pageData.id,
          user_id: userId,
          page_data: businessPageData,
          page_slug: pageSettings.slug
        });
      } else {
        await createPageDataMutation.mutateAsync({
          user_id: userId,
          page_data: businessPageData,
          page_slug: pageSettings.slug || generateSlug(pageSettings.title)
        });
      }
      
      toast({
        title: "Success",
        description: "Your page has been published!",
      });
    } catch (err) {
      console.error("Error publishing page:", err);
      toast({
        title: "Error",
        description: "Failed to publish page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Preview page
  const handlePreview = () => {
    setEditMode(false);
    // Navigate to preview mode or toggle preview state
    setTimeout(() => {
      setEditMode(true);
    }, 1500);
    
    toast({
      title: "Preview Mode",
      description: "This is a preview of your page. In a real deployment, you would see the actual page.",
    });
  };
  
  // Generate a slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  // Section CRUD operations
  const addSection = (type: string) => {
    const newSection: SectionType = {
      id: uuidv4(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: {},
      activeLayout: "standard",
    };
    
    setSections((prev) => [...prev, newSection]);
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
  };
  
  const updateSection = (index: number, updatedSection: SectionType) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };
  
  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    } else if (activeSectionIndex !== null && activeSectionIndex > index) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };
  
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index - 1);
    } else if (activeSectionIndex === index - 1) {
      setActiveSectionIndex(index);
    }
  };
  
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);
    
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <TopBar
        pageUrl={`https://${pageSettings.slug || 'example'}.wakti.app`}
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
        {/* Main content area - Preview */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <PagePreview
            sections={sections}
            activeSection={activeSection}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            addSection={addSection}
            pageSettings={pageSettings}
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
