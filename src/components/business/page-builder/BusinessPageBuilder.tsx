
import React, { useState, useEffect } from "react";
import { SettingsDialog } from "./components/SettingsDialog";
import { TopBar } from "./components/TopBar";
import { Separator } from "@/components/ui/separator";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BusinessPageContext, 
  BusinessPageData, 
  BusinessPageContextType 
} from "./context/BusinessPageContext";
import { 
  useCreatePageDataMutation, 
  useUpdatePageDataMutation,
  usePublishPageMutation
} from "@/hooks/business-page/useBusinessPageDataMutations";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";

const BusinessPageBuilder: React.FC = () => {
  // Initial page data state
  const [pageData, setPageData] = useState<BusinessPageData>({
    pageSetup: {
      businessName: "My Business",
      alignment: "center",
      visible: true
    },
    logo: {
      url: "",
      shape: "square",
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
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true
      },
      visible: true
    },
    workingHours: {
      layout: "card",
      hours: [
        { day: "Monday", open: "09:00", close: "17:00", closed: false },
        { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
        { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
        { day: "Thursday", open: "09:00", close: "17:00", closed: false },
        { day: "Friday", open: "09:00", close: "17:00", closed: false },
        { day: "Saturday", open: "10:00", close: "14:00", closed: true },
        { day: "Sunday", open: "00:00", close: "00:00", closed: true }
      ],
      visible: true
    },
    chatbot: {
      position: "right",
      embedCode: "",
      visible: false
    },
    theme: {
      backgroundColor: "#ffffff",
      textColor: "#333333",
      fontStyle: "sans-serif"
    },
    socialSidebar: {
      position: "right",
      platforms: {
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true
      },
      visible: false
    },
    contactInfo: {
      email: "",
      whatsapp: "",
      whatsappBusiness: "",
      phone: "",
      facebook: "",
      googleMaps: "",
      instagram: ""
    },
    sectionOrder: [
      "pageSetup",
      "logo",
      "bookings",
      "socialInline",
      "workingHours"
    ],
    published: false
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [userId, setUserId] = useState<string | null>(null);
  const [pageRecordId, setPageRecordId] = useState<string | null>(null);
  
  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    fetchUser();
  }, []);
  
  // Get the user's profile data
  const { profile, isLoading: profileLoading } = useUserProfile(userId || "");
  
  // Get existing page data
  const { 
    data: existingPageData,
    isLoading: pageDataLoading
  } = useBusinessPageDataQuery(userId || "");
  
  // Initialize mutations
  const createPageMutation = useCreatePageDataMutation();
  const updatePageMutation = useUpdatePageDataMutation();
  const publishPageMutation = usePublishPageMutation();
  
  // Load existing page data if available
  useEffect(() => {
    if (existingPageData?.page_data && !pageDataLoading) {
      setPageData(existingPageData.page_data);
      setPageRecordId(existingPageData.id || null);
      console.log("Loaded existing page data:", existingPageData);
    }
  }, [existingPageData, pageDataLoading]);
  
  // Update page data
  const updatePageData = (data: Partial<BusinessPageData>) => {
    setPageData(prev => ({
      ...prev,
      ...data
    }));
    setSaveStatus("unsaved");
  };
  
  // Update a specific section in the page data
  const updateSectionData = <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => {
    setPageData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setSaveStatus("unsaved");
  };
  
  // Handle saving the page
  const handleSave = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to save your business page."
      });
      return;
    }
    
    setSaveStatus("saving");
    try {
      // If we have an existing page, update it; otherwise create a new one
      if (pageRecordId) {
        await updatePageMutation.mutateAsync({
          id: pageRecordId,
          pageData,
          updateSlug: true
        });
      } else {
        const result = await createPageMutation.mutateAsync({
          userId,
          pageData
        });
        setPageRecordId(result.id || null);
      }
      
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving page:", error);
      setSaveStatus("unsaved");
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your changes."
      });
    }
  };
  
  // Handle publishing the page
  const handlePublish = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to publish your business page."
      });
      return;
    }
    
    if (!pageRecordId) {
      // Save first if we don't have a page record yet
      try {
        setSaveStatus("saving");
        const result = await createPageMutation.mutateAsync({
          userId,
          pageData: { ...pageData, published: true }
        });
        setPageRecordId(result.id || null);
        setSaveStatus("saved");
        return;
      } catch (error) {
        console.error("Error creating page before publishing:", error);
        setSaveStatus("unsaved");
        toast({
          variant: "destructive",
          title: "Publish failed",
          description: "There was a problem creating your page."
        });
        return;
      }
    }
    
    try {
      await publishPageMutation.mutateAsync({
        id: pageRecordId,
        published: !pageData.published,
        pageData
      });
      
      // Update the local state
      setPageData(prev => ({
        ...prev,
        published: !prev.published
      }));
      
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Publish failed",
        description: "There was a problem publishing your changes."
      });
    }
  };
  
  // Get the public page URL
  const getPublicPageUrl = () => {
    if (existingPageData?.page_slug) {
      return `www.wakti.qa/${existingPageData.page_slug}`;
    }
    
    // If we don't have a saved page, use the business name from profile
    if (profile?.business_name) {
      const slug = profile.business_name.toLowerCase().replace(/\s+/g, '-');
      return `www.wakti.qa/${slug}`;
    }
    
    return "www.wakti.qa/your-business-name";
  };
  
  // Context value
  const contextValue: BusinessPageContextType = {
    pageData,
    updatePageData,
    updateSectionData,
    saveStatus,
    handleSave,
  };
  
  // Show loading state while fetching data
  if (pageDataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading your business page...</div>
      </div>
    );
  }

  return (
    <BusinessPageContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        <TopBar 
          onSettingsClick={() => setSettingsOpen(true)} 
          pageData={pageData}
          businessName={profile?.business_name}
          onPublish={handlePublish}
          pageUrl={getPublicPageUrl()}
        />
        <Separator />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 p-4 overflow-auto">
            <PreviewPanel />
          </div>
        </div>
        <SettingsDialog 
          open={settingsOpen} 
          onClose={() => setSettingsOpen(false)} 
        />
      </div>
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;
