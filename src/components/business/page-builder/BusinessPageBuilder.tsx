
import React, { useState, useEffect } from "react";
import { BusinessPageContext, BusinessPageData, BusinessPageContextType } from "./context/BusinessPageContext";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { TopBar } from "./components/TopBar";
import { SettingsDialog } from "./components/SettingsDialog";
import { useUser } from "@/hooks/auth/useUser";  // Fixing the import path
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { useCreatePageDataMutation, useUpdatePageDataMutation, usePublishPageMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { supabase } from "@/integrations/supabase/client"; // Adding missing supabase import

// Default values for a new business page
const defaultPageData: BusinessPageData = {
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
      { day: "Monday", open: "9:00", close: "17:00", closed: false },
      { day: "Tuesday", open: "9:00", close: "17:00", closed: false },
      { day: "Wednesday", open: "9:00", close: "17:00", closed: false },
      { day: "Thursday", open: "9:00", close: "17:00", closed: false },
      { day: "Friday", open: "9:00", close: "17:00", closed: false },
      { day: "Saturday", open: "10:00", close: "14:00", closed: true },
      { day: "Sunday", open: "11:00", close: "16:00", closed: true }
    ],
    visible: true
  },
  chatbot: {
    position: "right",
    embedCode: "",
    visible: false
  },
  theme: {
    backgroundColor: "#f5f5f5",
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
    visible: true
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
    "logo",
    "bookings",
    "socialInline",
    "workingHours",
    "chatbot",
    "socialSidebar"
  ],
  published: false
};

const BusinessPageBuilder = () => {
  const { user } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pageData, setPageData] = useState<BusinessPageData>(defaultPageData);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  
  const { data: existingPageData, isLoading } = useBusinessPageDataQuery(user?.id);
  const createMutation = useCreatePageDataMutation();
  const updateMutation = useUpdatePageDataMutation();
  const publishMutation = usePublishPageMutation();
  
  // Load existing data if available
  useEffect(() => {
    if (existingPageData?.page_data) {
      setPageData(existingPageData.page_data);
      setSaveStatus('saved');
    }
  }, [existingPageData]);

  // Set save status to unsaved when page data changes
  useEffect(() => {
    if (!isLoading) {
      setSaveStatus('unsaved');
    }
  }, [pageData, isLoading]);

  // Update page data with partial data
  const updatePageData = (updatedData: Partial<BusinessPageData>) => {
    setPageData(prevData => ({...prevData, ...updatedData}));
    setSaveStatus('unsaved');
  };

  // Update specific section within page data
  const updateSectionData = <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => {
    setPageData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...Object.assign({}, data) // Fix for spread types error
      }
    }));
    setSaveStatus('unsaved');
  };
  
  // Handle save action
  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaveStatus('saving');
    try {
      if (existingPageData?.id) {
        // Update existing page
        await updateMutation.mutateAsync({
          id: existingPageData.id,
          pageData: pageData,
        });
      } else {
        // Create new page
        await createMutation.mutateAsync({
          pageData: pageData,
          userId: user.id,
        });
      }
      setSaveStatus('saved');
    } catch (error) {
      console.error("Error saving page:", error);
      setSaveStatus('unsaved');
    }
  };
  
  // Handle publish/unpublish action
  const handlePublish = async () => {
    if (!user?.id || !existingPageData?.id) {
      // If we don't have a saved page yet, save first then publish
      await handleSave();
      // Fetch the saved page data again
      const { data } = await supabase
        .from('business_pages_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .single();
        
      if (data) {
        await publishMutation.mutateAsync({
          id: data.id,
          pageData: pageData,
          published: !pageData.published,
        });
        
        setPageData(prev => ({...prev, published: !prev.published}));
      }
      return;
    }
    
    try {
      await publishMutation.mutateAsync({
        id: existingPageData.id,
        pageData: pageData,
        published: !pageData.published,
      });
      
      setPageData(prev => ({...prev, published: !prev.published}));
    } catch (error) {
      console.error("Error publishing page:", error);
    }
  };

  // Construct the public URL for the page
  const getPageUrl = () => {
    if (!existingPageData?.page_slug) return "";
    return `${existingPageData.page_slug}.wakti.app`;
  };

  const contextValue: BusinessPageContextType = {
    pageData,
    updatePageData,
    updateSectionData,
    saveStatus,
    handleSave,
  };

  return (
    <BusinessPageContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        <TopBar 
          onSettingsClick={() => setIsSettingsOpen(true)}
          pageData={pageData}
          businessName={user?.profile?.business_name ?? ""}
          onPublish={handlePublish}
          pageUrl={getPageUrl()}
        />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 p-4 overflow-auto">
            <PreviewPanel />
          </div>
        </div>
        <SettingsDialog 
          open={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;
